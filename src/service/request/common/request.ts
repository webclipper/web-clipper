import {
  IGetFormRequestOptions,
  IHelperOptions,
  IPostFormRequestOptions,
  IPostRequestOptions,
  RequestInterceptor,
  TRequestOption,
  IExtendRequestHelper,
  IPutRequestOptions,
} from '@/service/common/request';

export class RequestHelper implements IExtendRequestHelper {
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

  put<T>(url: string, options: Omit<IPutRequestOptions, 'method'>) {
    return this.request<T>(url, {
      ...options,
      method: 'put',
    });
  }

  get<T>(url: string, options?: Omit<IGetFormRequestOptions, 'method'>) {
    return this.request<T>(url, {
      ...options,
      method: 'get',
    });
  }

  private async request<T>(url: string, options: TRequestOption) {
    let requestUrl = url;
    let requestOptions = options;
    let requestInterceptors: RequestInterceptor[] | RequestInterceptor =
      this.options.interceptors?.request ?? [];

    if (requestInterceptors && !Array.isArray(requestInterceptors)) {
      requestInterceptors = [requestInterceptors] as RequestInterceptor[];
    }
    requestInterceptors = [this.basicRequestInterceptors.bind(this)].concat(requestInterceptors);
    for (const interceptor of requestInterceptors) {
      const res = interceptor(requestUrl, requestOptions);
      requestUrl = res.url ?? requestUrl;
      requestOptions = res.options ?? requestOptions;
    }
    return this.options.request.request<T>(requestUrl, requestOptions);
  }

  private basicRequestInterceptors(
    url: string,
    options: TRequestOption
  ): ReturnType<RequestInterceptor> {
    let requestUrl = url;
    if (!this.options.baseURL || url.match(/^https?:\/\//)) {
      requestUrl = url;
    } else {
      requestUrl = `${this.options.baseURL}${url}`;
    }
    return {
      url: requestUrl,
      options: {
        ...options,
        headers: {
          ...this.options?.headers,
          ...options.headers,
        },
      },
    };
  }
}
