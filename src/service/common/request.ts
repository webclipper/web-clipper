import { Token } from 'typedi';

export type Method = 'get' | 'post' | 'put';

export interface BaseRequestOptions {
  method: Method;
  headers?: Record<string, string>;
}

export interface IPostFormRequestOptions extends BaseRequestOptions {
  method: 'post';
  requestType: 'form';
  data: FormData;
}
export interface IPostRequestOptions extends BaseRequestOptions {
  method: 'post';
  requestType: 'json';
  data: any;
}

export interface IGetFormRequestOptions extends BaseRequestOptions {
  method: 'get';
}

export interface IPutRequestOptions extends BaseRequestOptions {
  method: 'put';
  data: any;
}

export type TRequestOption =
  | IGetFormRequestOptions
  | IPostRequestOptions
  | IPostFormRequestOptions
  | IPutRequestOptions;

export interface IRequestService {
  request<T>(url: string, options: TRequestOption): Promise<T>;
}

export type RequestInterceptor = (
  url: string,
  options: TRequestOption
) => {
  url?: string;
  options?: TRequestOption;
};

export interface IExtendRequestHelper {
  post<T>(url: string, options: Omit<IPostRequestOptions, 'method' | 'requestType'>): Promise<T>;
  postForm<T>(
    url: string,
    options: Omit<IPostFormRequestOptions, 'method' | 'requestType'>
  ): Promise<T>;

  put<T>(url: string, options: Omit<IPutRequestOptions, 'method'>): Promise<T>;

  get<T>(url: string, options?: Omit<IGetFormRequestOptions, 'method'>): Promise<T>;
}

export interface IHelperOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  request: IRequestService;
  interceptors?: {
    request?: RequestInterceptor[] | RequestInterceptor;
  };
}

export const IBasicRequestService = new Token<IRequestService>();
