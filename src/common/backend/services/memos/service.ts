import { DocumentService, CreateDocumentRequest } from '../../index';
import { extend, RequestMethod } from 'umi-request';
import md5 from '@web-clipper/shared/lib/md5';
import { MemosBackendServiceConfig } from './interface';
import { CompleteStatus } from '../interface';
import { Repository } from '@/common/backend/services/interface';

interface MemosUserResponse {
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  description: string;
}

interface UserInfo {
  name: string;
  avatar: string;
  homePage: string;
  description: string;
}

export default class MemosDocumentService implements DocumentService {
  private request: RequestMethod;
  private token: string;
  private origin: string;
	private userInfo: UserInfo | null;

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
    this.userInfo = null;
  }

  getId = () => {
		return '0';
	};

  getUserInfo = async (): Promise<UserInfo> => {
    const response = await this.request.post<MemosUserResponse>('v1/auth/status');

    const userInfo: UserInfo = {
      name: response.username || 'Memos User',
      avatar: response.avatarUrl
        ? `${this.origin}${response.avatarUrl}`
        : 'https://demo.usememos.com/full-logo.webp',
      homePage: this.origin,
      description: response.description || 'Memos User',
    };

    this.userInfo = userInfo;
    return userInfo;
  };


  createDocument = async (
    info: CreateDocumentRequest
  ): Promise<CompleteStatus> => {
    if (!this.userInfo) {
      this.userInfo = await this.getUserInfo();
    }

    const response = await this.request.post<{
      id: string;
      content: string;
      creator: string;
    }>('v1/memos', {
      data: {
        content: info.content,
        visibility: 'PRIVATE',
      },
    });

    return {
      href: `${this.origin}/u/${this.userInfo.name}`,
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
