import { Token } from 'typedi';

export interface WebBlockHeader {
  name: string;
  value: string;
}

export interface WebRequestBlockOption {
  requestHeaders: chrome.webRequest.HttpHeader[];
  urls: string[];
}

export interface RequestInBackgroundOptions {
  method?: string;
  data?: any;
  prefix?: string;
  headers?: HeadersInit;
}

export interface IWebRequestService {
  startChangeHeader(option: WebRequestBlockOption): Promise<WebBlockHeader>;

  end(webBlockHeader: WebBlockHeader): Promise<void>;

  requestInBackground<T>(url: string, options?: RequestInBackgroundOptions): Promise<T>;
}

export const IWebRequestService = new Token<IWebRequestService>();
