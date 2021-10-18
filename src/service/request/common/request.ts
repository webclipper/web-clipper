import { ResponseInterceptor } from './../../common/request';
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
  constructor(private options: IHelperOptions) {
    //
  }

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

  private async request<T>(url: string, options: TRequestOption): Promise<T> {
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
    let result = await this.options.request.request<T>(requestUrl, requestOptions);

    let responseInterceptors: ResponseInterceptor[] | ResponseInterceptor =
      this.options.interceptors?.response ?? [];
    if (responseInterceptors && !Array.isArray(responseInterceptors)) {
      responseInterceptors = [responseInterceptors] as ResponseInterceptor[];
    }
    for (const interceptor of responseInterceptors) {
      result = interceptor(result) as T;
    }
    return result;
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
    const parsedUrl = new URL(requestUrl);
    if (this.options.params) {
      const keys = Object.keys(this.options.params);
      for (const key of keys) {
        if (!parsedUrl.searchParams.has(key)) {
          parsedUrl.searchParams.append(key, this.options.params[key]);
        }
      }
    }
    return {
      url: parsedUrl.href,
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
