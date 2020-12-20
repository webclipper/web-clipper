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

export type RequestInterceptor = (
  url: string,
  options: TRequestOption
) => {
  url?: string;
  options?: TRequestOption;
};
export interface IHelperOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  request: IRequest;
  interceptors?: {
    request?: RequestInterceptor[] | RequestInterceptor;
  };
}
export class RequestHelper implements IRequest {
  constructor(private options: IHelperOptions) {}

  post<T>(url: string, options: Omit<IPostRequestOptions, 'method' | 'requestType'>) {
    return this.request<T>(url, {
      ...options,
      method: 'post',
      requestType: 'json',
    });
  }

  postForm<T>(url: string, options: Omit<IPostFormRequestOptions, 'method' | 'requestType'>) {
    return this.request<T>(url, {
      ...options,
      method: 'post',
      requestType: 'form',
    });
  }

  get<T>(url: string, options: IGetFormRequestOptions) {
    return this.request<T>(url, options);
  }

  async request<T>(url: string, options: TRequestOption) {
    let requestUrl = this.getUrl(url);
    let requestOptions = options;
    let requestInterceptors: RequestInterceptor[] | RequestInterceptor =
      this.options.interceptors?.request || [];
    if (requestInterceptors && !Array.isArray(requestInterceptors)) {
      requestInterceptors = [requestInterceptors] as RequestInterceptor[];
    }
    for (const interceptor of requestInterceptors) {
      const res = interceptor(requestUrl, requestOptions);
      requestUrl = res.url ?? requestUrl;
      requestOptions = res.options ?? requestOptions;
    }
    return this.options.request.request<T>(requestUrl, requestOptions);
  }

  private getUrl(url: string): string {
    if (!this.options.baseURL || url.match(/^https?:\/\//)) {
      return url;
    }
    return `${this.options.baseURL}${url}`;
  }
}
