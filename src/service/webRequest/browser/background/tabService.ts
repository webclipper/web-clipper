import { generateUuid } from '@web-clipper/shared/lib/uuid';
import {
  IWebRequestService,
  WebRequestBlockOption,
  WebBlockHeader,
} from '@/service/common/webRequest';

import { Service } from 'typedi';

export const WEB_REQUEST_BLOCK_HEADER = 'web_clipper_web_request';

class BackgroundWebRequestService implements IWebRequestService {
  private handlerMap: Map<string, any>;

  constructor() {
    this.handlerMap = new Map<string, any>();
  }

  async startChangeHeader(option: WebRequestBlockOption): Promise<WebBlockHeader> {
    const uuid = generateUuid();
    const targetHeaders = option.requestHeaders.map(o => ({
      name: o.name.toLocaleLowerCase(),
      value: o.value,
    }));

    const handler = (request: chrome.webRequest.WebRequestHeadersDetails) => {
      const originHeaders = request.requestHeaders ?? [];
      if (originHeaders.findIndex(o => o.name === WEB_REQUEST_BLOCK_HEADER) === -1) {
        return;
      }
      const headers = originHeaders
        .filter(header => {
          return !targetHeaders.find(o => o.name === header.name.toLocaleLowerCase());
        })
        .concat(targetHeaders);

      return {
        requestHeaders: headers,
      };
    };

    this.handlerMap.set(uuid, handler);
    chrome.webRequest.onBeforeSendHeaders.addListener(handler, { urls: option.urls }, [
      'blocking',
      'requestHeaders',
      'extraHeaders',
    ]);
    return {
      name: WEB_REQUEST_BLOCK_HEADER,
      value: uuid,
    };
  }

  async end(webBlockHeader: WebBlockHeader): Promise<void> {
    const handler = this.handlerMap.get(webBlockHeader.value);
    this.handlerMap.delete(webBlockHeader.value);
    chrome.webRequest.onBeforeSendHeaders.removeListener(handler);
    chrome.webRequest.handlerBehaviorChanged();
  }
}

Service(IWebRequestService)(BackgroundWebRequestService);
