import { DocumentService } from './../../index';
import {
  FeishuBackendServiceConfig,
  FeishuUserInfoResponse,
  FeishuCompleteStatus,
  FeishuCreateDocumentRequest,
} from './interface';
import md5 from '@web-clipper/shared/lib/md5';

const OPEN_API = 'https://open.feishu.cn';

export default class FeishuDocumentService implements DocumentService {
  private userInfo?: any;
  private config: FeishuBackendServiceConfig;

  constructor(config: FeishuBackendServiceConfig) {
    this.config = config;
  }

  getId = () => md5(this.config.workerUrl);

  refreshToken = async (info: FeishuBackendServiceConfig): Promise<FeishuBackendServiceConfig> => {
    console.log('Feishu Refresh Token Called', {
      hasRefreshToken: !!info.refreshToken,
      workerUrl: info.workerUrl
    });
    if (!info.refreshToken || !info.workerUrl) {
      throw new Error('Missing refresh token or worker url');
    }
    const workerUrl = info.workerUrl.trim();
    const workerRefreshUrl = `${workerUrl.replace(/\/$/, '')}/refresh`;
    console.log('Feishu Refresh URL:', workerRefreshUrl);

    try {
      const response = await fetch(workerRefreshUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: info.refreshToken })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      return {
        ...info,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Math.floor(Date.now() / 1000) + (Number(data.expires_in) || 7200)
      };
    } catch (e: any) {
      console.error('RefreshToken Error:', e);
      throw new Error(`Failed to refresh token: ${e.message}`);
    }
  }

  private getAccessToken = async () => {
    // Check expiration
    const expiresAt = Number(this.config.expiresAt);
    const now = Date.now() / 1000;
    const shouldRefresh = expiresAt && now > expiresAt - 300;

    console.log('Feishu GetAccessToken:', {
      expiresAt,
      now,
      shouldRefresh,
      accessToken: this.config.accessToken ? 'exists' : 'missing'
    });

    if (shouldRefresh) {
      // Token expired or about to expire (5 mins buffer)
      try {
        const newConfig = await this.refreshToken(this.config);
        this.config = newConfig;
        // Note: In a real app, we should persist this new config back to storage.
        // But DocumentService interface doesn't easily support saving back config unless called by upper layer.
        // However, typical usage is: upper layer checks if `refreshToken` method exists, call it, and save result.
        // Current Clipper architecture might not auto-save refreshed token easily.
        // We'll rely on in-memory update for this session. 
        // If the architecture supports `refreshToken` hook (interface line 81), it will work.
      } catch (e) {
        console.error('Refresh token failed', e);
        throw new Error('Session expired, please login again via Worker.');
      }
    }
    return this.config.accessToken;
  };

  private requestWithToken = async <T>(path: string, method: 'GET' | 'POST' | 'PATCH', data?: any) => {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('Access token is missing. Please re-login.');
    }
    const url = `${OPEN_API}${path}`;
    // Aggressively clean token: remove all whitespace including internal newlines
    const cleanToken = token.replace(/\s+/g, '');

    console.log('Feishu Request:', {
      url,
      method,
      tokenLength: cleanToken.length,
      data: data ? JSON.stringify(data) : undefined
    });

    try {
      const headers = new Headers({
        'Authorization': `Bearer ${cleanToken}`,
      });

      if (method === 'POST' || method === 'PATCH') {
        headers.append('Content-Type', 'application/json');
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if ((method === 'POST' || method === 'PATCH') && data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const json = await response.json();

      if (json.code !== 0) {
        console.error('Feishu API Error:', json);
        throw new Error(json.msg || `Feishu API Error code: ${json.code}`);
      }

      return json.data as T;
    } catch (e: any) {
      console.error('Feishu Request Failed:', e);
      // Explicitly catch Headers error
      if (e.message && e.message.includes('Headers')) {
        throw new Error(`Invalid Token Format: Contains illegal characters. Length: ${cleanToken.length}`);
      }
      throw e;
    }
  };

  getUserInfo = async () => {
    if (!this.userInfo) {
      // Get User Info
      // Endpoint: GET https://open.feishu.cn/open-apis/authen/v1/user_info
      this.userInfo = await this.requestWithToken<FeishuUserInfoResponse['data']>('/open-apis/authen/v1/user_info', 'GET');
    }
    const { avatar_url, name, en_name } = this.userInfo;
    return {
      avatar: avatar_url,
      name: name || en_name,
      homePage: 'https://www.feishu.cn/drive/home/',
      description: 'Feishu User',
    };
  };

  getRepositories = async () => {
    // List "My Space" root folder children?
    // User Access Token allows access to user's files.
    // Let's just return a "Root" repository which represents "My Space".
    // Or we can list folders in root.

    // For User Identity, we can use Explorer API
    try {
      const rootMeta = await this.requestWithToken<any>('/open-apis/drive/explorer/v2/root_folder/meta', 'GET');
      return [{
        id: rootMeta.token,
        name: '我的空间 (My Space)',
        groupId: 'me',
        groupName: 'Personal',
      }];
    } catch (e) {
      return [{
        id: 'root',
        name: '我的空间 (My Space)',
        groupId: 'me',
        groupName: 'Personal',
      }];
    }
  };

  private uploadImage = async (url: string, parentNode: string): Promise<string | null> => {
    try {
      console.log('Downloading image:', url);
      const imgRes = await fetch(url);
      if (!imgRes.ok) {
        console.error('Image download failed:', imgRes.status);
        return null;
      }
      const blob = await imgRes.blob();

      const formData = new FormData();
      formData.append('file_name', 'image.png');
      formData.append('parent_type', 'docx_image');
      formData.append('parent_node', parentNode);
      formData.append('size', String(blob.size));
      formData.append('file', blob);

      const token = await this.getAccessToken();
      const uploadRes = await fetch(`${OPEN_API}/open-apis/drive/v1/medias/upload_all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const json = await uploadRes.json();
      if (json.code !== 0) {
        console.error('Feishu Image Upload Error:', json);
        return null;
      }
      console.log('Image uploaded, token:', json.data.file_token);
      return json.data.file_token;
    } catch (e) {
      console.error('Image upload exception:', e);
      return null;
    }
  }

  private batchUpdateBlocks = async (documentId: string, updates: { blockId: string, token: string }[]) => {
    if (updates.length === 0) return;
    try {
      const requests = updates.map(u => ({
        block_id: u.blockId,
        replace_image: { token: u.token }
      }));
      await this.requestWithToken<any>(`/open-apis/docx/v1/documents/${documentId}/blocks/batch_update`, 'PATCH', { requests });
      console.log(`Batch updated ${updates.length} images.`);
    } catch (e) {
      console.error('Failed to batch update blocks:', e);
    }
  }

  createDocument = async (info: FeishuCreateDocumentRequest): Promise<FeishuCompleteStatus> => {
    const { title, content, repositoryId } = info;

    // 1. Create Document
    const createRes = await this.requestWithToken<any>('/open-apis/docx/v1/documents', 'POST', {
      folder_token: repositoryId,
      title: title,
    });

    const documentId = createRes.document.document_id;

    // 2. Parse Content into Segments
    const parts = content.split(/(!\[.*?\]\(.*?\))/g);
    const segments: { type: 'text' | 'image', data: string }[] = [];

    parts.forEach(part => {
      const imageMatch = part.match(/!\[.*?\]\((.*?)\)/);
      if (imageMatch) {
        segments.push({ type: 'image', data: imageMatch[1] });
      } else if (part) {
        // Split text by newlines to avoid "invalid param" for huge text blocks
        const lines = part.split(/\r?\n/);
        lines.forEach(line => {
          segments.push({ type: 'text', data: line });
        });
      }
    });

    // 3. Create Blocks in Chunks
    if (segments.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < segments.length; i += chunkSize) {
        const chunk = segments.slice(i, i + chunkSize);

        // Create blocks with empty image tokens
        const childrenPayload = chunk.map(seg => {
          if (seg.type === 'image') {
            return {
              block_type: 27,
              image: { token: "" } // Placeholder
            };
          } else {
            return {
              block_type: 2,
              text: { elements: [{ text_run: { content: seg.data } }] }
            };
          }
        });

        const createChildrenRes = await this.requestWithToken<any>(
          `/open-apis/docx/v1/documents/${documentId}/blocks/${documentId}/children`,
          'POST',
          { children: childrenPayload, index: -1 }
        );

        // 4. Process Images: Upload and Collect Updates
        const createdChildren = createChildrenRes.children;
        const uploadPromises: Promise<{ blockId: string, token: string | null }>[] = [];

        for (let j = 0; j < chunk.length; j++) {
          if (chunk[j].type === 'image' && createdChildren[j]) {
            const blockId = createdChildren[j].block_id;
            const imageUrl = chunk[j].data;

            // Initiate upload
            uploadPromises.push(
              this.uploadImage(imageUrl, blockId)
                .then(token => ({ blockId, token }))
            );
          }
        }

        // Wait for all uploads in this chunk
        if (uploadPromises.length > 0) {
          const results = await Promise.all(uploadPromises);
          const updates = results
            .filter(r => r.token !== null)
            .map(r => ({ blockId: r.blockId, token: r.token as string }));

          // Batch update images
          await this.batchUpdateBlocks(documentId, updates);
        }
      }
    }

    return {
      href: `https://feishu.cn/docx/${documentId}`,
      repositoryId,
      documentId,
    };
  };
}
