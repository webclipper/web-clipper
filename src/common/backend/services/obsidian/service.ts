import { CompleteStatus, HttpError, UnauthorizedError } from './../interface';
import { DocumentService, CreateDocumentRequest } from '../../index';
import axios, { AxiosInstance } from 'axios';
import { ObsidianBackendServiceConfig } from './interface';
function pathJoin(parts: string[], separator: string = '/') {
  let replace = new RegExp(`${separator}{1,}`, 'g');
  return parts.join(separator).replace(replace, separator);
}
export default class ObsidianDocumentService implements DocumentService {
  private request: AxiosInstance;

  constructor(private config: ObsidianBackendServiceConfig) {
    const request = axios.create({
      baseURL: config.endPoint ?? 'http://127.0.0.1:27123',
      timeout: 10000,
      headers: {
        Authorization: config.accessToken ? `Bearer ${config.accessToken}` : '',
      },
    });
    this.request = request;
    this.request.interceptors.response.use(
      r => r,
      error => {
        if (!axios.isAxiosError(error)) {
          return Promise.reject(error);
        }
        if (error.response?.status === 401) {
          return Promise.reject(new UnauthorizedError(error.response.data.message));
        }
        if (error.response?.data?.errorCode) {
          return Promise.reject(
            new HttpError({
              status: error.response.data.errorCode,
              message: error.response.data.message,
            })
          );
        }
        return Promise.reject(error);
      }
    );
  }

  getId = () => {
    return 'obsidian';
  };

  getRepositories = async () => {
    return [
      {
        id: 'obsidian',
        name: `Send to obsidian`,
        groupId: 'obsidian',
        groupName: 'Obsidian',
      },
    ];
  };

  createDocument = async ({
    url,
    title,
    content,
  }: CreateDocumentRequest): Promise<CompleteStatus> => {
    const fullPath = pathJoin([this.config.directory ?? '', `${title}.md`]);
    await this.request.put(
      `/vault/${encodeURIComponent(fullPath)}`,
      `---
source: ${url}
---
${content}
`,
      {
        headers: {
          'Content-type': 'text/markdown',
        },
      }
    );
    return {
      href: `obsidian://open?file=${encodeURIComponent(title)}`,
    };
  };

  getUserInfo = async () => {
    // 先请求下, 确保接能通
    await this.request.get('/vault/');

    return {
      name: 'Obsidian',
      avatar: 'https://avatars.githubusercontent.com/u/65011256?s=200&v=4',
      homePage: 'https://obsidian.md',
      description: `send to obsidian 
by obsidian-local-rest-api`,
    };
  };
}
