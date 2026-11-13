import { IRequestService } from '@/service/common/request';

export interface ISiyuanBackendServiceConfig {
  accessToken?: string;
  /**
   * 思源笔记内核的接口地址，支持远端地址，默认 http://127.0.0.1:6806/
   */
  origin?: string;
}

export interface ISiyuanClientOptions {
  request: IRequestService;
  accessToken?: string;
  origin?: string;
}

export interface ISiyuanUploadImageResponse {
  data: {
    succMap: {
      [key: string]: string;
    };
  };
}

export interface ISiyuanFetchNotesResponse {
  data: {
    files?: string[] | { name: string; id: string; closed?: boolean }[];
    notebooks?: string[] | { name: string; id: string; closed?: boolean }[];
  };
}
