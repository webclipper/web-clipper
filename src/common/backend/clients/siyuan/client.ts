import { CreateDocumentRequest } from './../../services/interface';
import { IExtendRequestHelper } from '@/service/common/request';
import { RequestHelper } from '@/service/request/common/request';
import {
  ISiyuanClientOptions,
  ISiyuanUploadImageResponse,
  ISiyuanFetchNotesResponse,
} from './types';

const SIYUAN_BASE_URL = 'http://127.0.0.1:6806/';

export class SiYuanClient {
  private options: ISiyuanClientOptions;
  private request: IExtendRequestHelper;

  constructor(options: ISiyuanClientOptions) {
    this.options = options;
    const headers: Record<string, string> = {};
    if (options.accessToken) {
      headers.Authorization = `Token ${options.accessToken}`;
    }
    this.request = new RequestHelper({
      baseURL: SIYUAN_BASE_URL,
      headers: headers,
      request: this.options.request,
    });
  }

  listNotebooks = async (): Promise<string[]> => {
    const res = await this.request.post<ISiyuanFetchNotesResponse>(`api/notebook/ls`, {
      data: {},
    });
    return res.data.files.map(p => p.split('/')[p.split('/').length - 1]);
  };

  createNote = async (data: CreateDocumentRequest) => {
    const response = await this.request.post<{ code: number; msg: string; data: string }>(
      `api/filetree/createDocWithMd`,
      {
        data: {
          notebook: data.repositoryId,
          path: `${data.title}.sy`,
          markdown: data.content,
        },
      }
    );
    if (response.code !== 0) {
      throw new Error(response.msg);
    }
    return response.data;
  };

  uploadImage = async (blob: Blob, notebook: string) => {
    let formData = new FormData();
    formData.append('assetsDirPath', `${notebook}/assets/`);
    const fileName = `${Date.now()}.png`;
    formData.append('file[]', new File([blob], fileName));
    const response = await this.request.postForm<ISiyuanUploadImageResponse>(`api/asset/upload`, {
      data: formData,
    });
    return `${SIYUAN_BASE_URL}${response.data.succMap[fileName]}`;
  };
}
