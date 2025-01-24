import { DocumentService } from '../../index';
import { extend, RequestMethod } from 'umi-request';
import { CompleteStatus } from '../interface';
import { Repository } from '@/common/backend/services/interface';
import {
	MemosBackendServiceConfig,
	MemoCreateDocumentRequest,
	MemosUserResponse,
	MemosUserInfo
} from './interface';


export default class MemosDocumentService implements DocumentService {
  private request: RequestMethod;
  private token: string;
  private origin: string;
	private UserInfo: MemosUserInfo | null;

  constructor({ accessToken, origin }: MemosBackendServiceConfig) {
    const realHost = origin || 'https://demo.usememos.com';
    this.request = extend({
      prefix: `${realHost}/api/`,
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 5000,
    });
    this.request.interceptors.response.use(
      async response => {
        if (!response.ok) {
          const json = await response.clone().json();
          throw new Error(`(${response.status}) Err_id=${json.code || ''}: ${json.message || '未知错误'}`);
        }
        return response;
      },
      error => {
        if (error.response) {
          // 服务器返回错误
          return error.response.json().then((json: any) => {
            throw new Error(`(${error.response.status}) code=${json.id || ''}: ${json.message || error.message || '未知错误'}`);
          });
        }
        // (50X)网络错误等
        throw new Error(`(500): ${error.message || '网络错误'}`);
      },
    );
    this.token = accessToken;
    this.origin = realHost;
    this.UserInfo = null;
  }

  getId = () => {
		return '0';
	};

  getUserInfo = async (): Promise<MemosUserInfo> => {
    const response = await this.request.post<MemosUserResponse>('v1/auth/status');

    const MemosUserInfo: MemosUserInfo = {
      name: response.username || 'Memos User',
      avatar: response.avatarUrl
        ? `${this.origin}${response.avatarUrl}`
        : 'https://demo.usememos.com/full-logo.webp',
      homePage: this.origin,
      description: response.description || 'Memos User',
    };

    this.UserInfo = MemosUserInfo;
    return MemosUserInfo;
  };

  private addTag = (tags: string, content: string): string => {
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const formattedTags = tagArray.map(tag => `#${tag}`).join(' ');
    return `${content}\n${formattedTags}`;
  };

  createDocument = async (
    info: MemoCreateDocumentRequest
  ): Promise<CompleteStatus> => {
    if (!this.UserInfo) {
      this.UserInfo = await this.getUserInfo();
    }

    if (info.tags) {
      info.content = this.addTag(info.tags, info.content);
    }

    const response = await this.request.post<{
      id: string;
      content: string;
      creator: string;
    }>('v1/memos', {
      data: {
        content: info.content,
        visibility: info.visibility || 'PRIVATE',
      },
    });

    return {
      href: `${this.origin}/u/${this.UserInfo.name}`,
    };
  };

  getRepositories = async (): Promise<Repository[]> => {
    return [{
      id: 'memos_default',
      name: '默认分区 Default Repo',
      groupId: 'memos',
      groupName: '默认分组 Defualt Group',
    }];
  };
}
