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
