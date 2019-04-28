import {
  DocumentService,
  Repository,
  CreateDocumentRequest,
} from '../../index';
import axios, { AxiosInstance } from 'axios';
import { generateUuid } from '../../../uuid';

interface NotionUserContent {
  recordMap: {
    notion_user: {
      [uuid: string]: {
        role: string;
        value: {
          id: string;
          email: string;
          given_name: string;
          family_name: string;
          profile_photo: string;
        };
      };
    };
    space: {
      [id: string]: {
        role: string;
        value: {
          id: string;
          name: string;
          domain: string;
          pages: string[];
        };
      };
    };
    block: {
      [uuid: string]: {
        role: string;
        value: {
          id: string;
          version: string;
          parent_id: string;
          type: string;
          created_time: number;
          properties: {
            title: string[][];
            content: string[];
          };
        };
      };
    };
  };
}

export default class NotionDocumentService implements DocumentService {
  private request: AxiosInstance;
  private repositories: Repository[];
  private userContent?: NotionUserContent;

  constructor() {
    const request = axios.create({
      baseURL: 'https://www.notion.so/',
      timeout: 10000,
      transformResponse: [
        (data): any => {
          // 做任何你想要的数据转换
          return JSON.parse(data);
        },
      ],
      withCredentials: true,
    });
    this.request = request;
    this.repositories = [];
  }

  getId = () => {
    return 'notion';
  };

  getUserInfo = async () => {
    if (!this.userContent) {
      this.userContent = await this.getUserContent();
    }
    const user = this.userContent.recordMap.notion_user;
    const userInfo = Object.values(user)[0];
    const { email, profile_photo, given_name, family_name } = userInfo.value;
    return {
      name: `${given_name}${family_name}`,
      avatar: profile_photo,
      homePage: 'https://www.notion.so/',
      description: email,
    };
  };

  getRepositories = async () => {
    if (!this.userContent) {
      this.userContent = await this.getUserContent();
    }

    const spaces = this.userContent.recordMap.space;
    const blocks = this.userContent.recordMap.block;
    if (!blocks) {
      this.repositories = [];
      return [];
    }
    const result = Object.values(blocks)
      .filter(({ value }) => !!value.properties && !!spaces[value.parent_id])
      .map(
        ({ value }): Repository => ({
          id: value.id,
          name: value.properties.title.toString(),
          groupId: spaces[value.parent_id].value.domain,
          groupName: spaces[value.parent_id].value.name,
        })
      );

    this.repositories = result;

    return result;
  };

  createDocument = async ({
    repositoryId,
    title,
    content,
  }: CreateDocumentRequest) => {
    let fileName = `${title}.md`;
    const documentId = await this.createEmptyFile(repositoryId, content);
    const fileUrl = await this.getFileUrl(fileName);
    await axios.put(fileUrl.signedPutUrl, `${content}`, {
      headers: {
        'Content-Type': 'text/markdown',
      },
    });
    await this.request.post('api/v3/enqueueTask', {
      task: {
        eventName: 'importFile',
        request: {
          fileURL: fileUrl.url,
          fileName,
          importType: 'ReplaceBlock',
          pageId: documentId,
        },
      },
    });
    const repository = this.repositories.find(o => o.id === repositoryId);
    if (!repository) {
      throw new Error('仓库非法');
    }
    return {
      href: `https://www.notion.so/${repository.groupId}/${documentId.replace(
        /-/g,
        ''
      )}`,
      repositoryId: repositoryId,
      documentId,
    };
  };

  createEmptyFile = async (parentId: string, title: string) => {
    if (!this.userContent) {
      this.userContent = await this.getUserContent();
    }
    const documentId = generateUuid();
    const userId = Object.values(this.userContent.recordMap.notion_user)[0]
      .value.id;
    const time = new Date().getDate();
    await this.request.post('api/v3/submitTransaction', {
      operations: [
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'set',
          args: {
            type: 'page',
            id: documentId,
            version: 1,
          },
        },
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'update',
          args: {
            parent_id: parentId,
            parent_table: 'block',
            alive: true,
          },
        },
        {
          table: 'block',
          id: parentId,
          path: ['content'],
          command: 'listAfter',
          args: { id: documentId },
        },
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'update',
          args: {
            created_by: userId,
            created_time: time,
            last_edited_time: time,
            last_edited_by: userId,
          },
        },
        {
          id: parentId,
          table: 'block',
          path: [],
          command: 'update',
          args: { last_edited_time: time },
        },
        {
          id: documentId,
          table: 'block',
          path: ['properties', 'title'],
          command: 'set',
          args: [[title]],
        },
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'update',
          args: { last_edited_time: time },
        },
      ],
    });
    return documentId;
  };

  getFileUrl = async (fileName: string) => {
    const result = await this.request.post<{
      url: string;
      signedPutUrl: string;
    }>('api/v3/getUploadFileUrl', {
      bucket: 'temporary',
      name: fileName,
      contentType: 'text/markdown',
    });
    return result.data;
  };

  private getUserContent = async () => {
    const response = await this.request.post<NotionUserContent>(
      'api/v3/loadUserContent'
    );
    return response.data;
  };
}
