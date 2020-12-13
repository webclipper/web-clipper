export interface IPostFormRequestOptions {
  headers?: Record<string, string>;
  requestType: 'form';
  data: FormData;
}

export interface IPostRequestOptions {
  data?: any;
}

export interface IRequest {
  post<T>(url: string, options: IPostRequestOptions): Promise<T>;
  postForm<T>(url: string, options: IPostFormRequestOptions): Promise<T>;
  get<T>(url: string): Promise<T>;
}

export interface IHelperOptions {
  baseURL: string;
  headers: Record<string, string>;
  request: IRequest;
}

export class RequestHelper implements IRequest {
  constructor(private options: IHelperOptions) {}

  post<T>(url: string, options: IPostRequestOptions) {
    return this.options.request.post<T>(url, options);
  }

  postForm<T>(url: string, options: IPostFormRequestOptions) {
    return this.options.request.postForm<T>(url, options);
  }

  get<T>(url: string) {
    return this.options.request.get<T>(url);
  }
}
