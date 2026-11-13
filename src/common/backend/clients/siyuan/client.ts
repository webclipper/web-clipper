import { CreateDocumentRequest } from './../../services/interface';
import { IExtendRequestHelper } from '@/service/common/request';
import { RequestHelper } from '@/service/request/common/request';
import {
  ISiyuanClientOptions,
  ISiyuanUploadImageResponse,
  ISiyuanFetchNotesResponse,
} from './types';
import { normalizeSiyuanBaseUrl } from './utils';

export class SiYuanClient {
  private options: ISiyuanClientOptions;
  private request: IExtendRequestHelper;
  private baseUrl: string;

  constructor(options: ISiyuanClientOptions) {
    this.options = options;
    this.baseUrl = normalizeSiyuanBaseUrl(options.origin);
    const headers: Record<string, string> = {};
    if (options.accessToken) {
      headers.Authorization = `Token ${options.accessToken}`;
    }
    this.request = new RequestHelper({
      baseURL: this.baseUrl,
      headers: headers,
      request: this.options.request,
    });
  }

  listNotebooks = async (): Promise<{ id: string; name: string }[]> => {
    const res = await this.request.post<ISiyuanFetchNotesResponse>(`api/notebook/lsNotebooks`, {
      data: {},
    });
    return (res.data.notebooks ?? res.data.files ?? [])
      .map(p => {
        if (typeof p === 'object') {
          return p;
        }
        return {
          name: p.split('/')[p.split('/').length - 1],
          id: p.split('/')[p.split('/').length - 1],
          closed: false,
        };
      })
      .filter(e => {
        return !e.closed;
      });
  };

  createNote = async (data: CreateDocumentRequest) => {
    const response = await this.request.post<{ code: number; msg: string; data: string }>(
      `api/filetree/createDocWithMd`,
      {
        data: {
          notebook: data.repositoryId,
          path: `${data.title}.sy`,
          markdown: data.content.replaceAll(this.baseUrl, ''),
        },
      }
    );
    if (response.code !== 0) {
      throw new Error(response.msg);
    }
    return response.data;
  };

  uploadImage = async (blob: Blob) => {
    let formData = new FormData();
    formData.append('assetsDirPath', '/assets/');
    const fileName = `${Date.now()}.png`;
    formData.append('file[]', new File([blob], fileName));
    const response = await this.request.postForm<ISiyuanUploadImageResponse>(`api/asset/upload`, {
      data: formData,
    });
    return `${this.baseUrl}${response.data.succMap[fileName]}`;
  };
}
