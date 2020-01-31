import { Token } from 'typedi';

export interface WebBlockHeader {
  name: string;
  value: string;
}

export interface WebRequestBlockOption {
  requestHeaders: chrome.webRequest.HttpHeader[];
  urls: string[];
}

export interface IWebRequestService {
  startChangeHeader(option: WebRequestBlockOption): Promise<WebBlockHeader>;

  end(webBlockHeader: WebBlockHeader): Promise<void>;
}

export const IWebRequestService = new Token<IWebRequestService>();
