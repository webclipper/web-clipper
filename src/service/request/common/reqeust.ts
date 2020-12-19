export type Method = 'get' | 'post';

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

export type TRequestOption = IGetFormRequestOptions | IPostRequestOptions | IPostFormRequestOptions;

export interface IRequest {
  request<T>(url: string, options: TRequestOption): Promise<T>;
}

export interface IHelperOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  request: IRequest;
}

export class RequestHelper implements IRequest {
  constructor(private options: IHelperOptions) {}

  post<T>(url: string, options: IPostRequestOptions) {
    return this.options.request.request<T>(this.getUrl(url), options);
  }

  postForm<T>(url: string, options: IPostFormRequestOptions) {
    return this.options.request.request<T>(this.getUrl(url), options);
  }

  get<T>(url: string, options: IGetFormRequestOptions) {
    return this.options.request.request<T>(this.getUrl(url), options);
  }

  request<T>(url: string, options: TRequestOption) {
    return this.options.request.request<T>(url, options);
  }

  private getUrl(url: string): string {
    if (!this.options.baseURL || url.match(/^https?:\/\//)) {
      return url;
    }
    return `${this.options.baseURL}${url}`;
  }
}
