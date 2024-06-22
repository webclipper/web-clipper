import {
  IWebRequestService,
  RequestInBackgroundOptions,
  WebBlockHeader,
  WebRequestBlockOption,
} from '@/service/common/webRequest';
import queryString from 'query-string';
import short from 'short-uuid';
import request from 'umi-request';

export class BackgroundWebRequestService implements IWebRequestService {
  private startCounter: number;
  private handlerMap: Map<string, { ruleId: number[] }>;

  constructor() {
    this.handlerMap = new Map<string, any>();
    this.startCounter = Math.floor(Date.now() / 1000);
  }

  private getRuleId() {
    return this.startCounter++;
  }

  async startChangeHeader(option: WebRequestBlockOption): Promise<WebBlockHeader> {
    const uuid = short.generate();
    const modifyHeadersAction: chrome.declarativeNetRequest.RuleAction = {
      type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
      requestHeaders: option.requestHeaders.map((header) => ({
        header: header.name,
        operation: 'set' as chrome.declarativeNetRequest.HeaderOperation,
        value: header.value,
      })),
    } as const;
    const ruleId = this.getRuleId();
    const rule: chrome.declarativeNetRequest.Rule = {
      id: ruleId,
      priority: 3,
      action: modifyHeadersAction,
      condition: {
        urlFilter: uuid,
      },
    };
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [rule],
      removeRuleIds: [],
    });
    this.handlerMap.set(uuid, {
      ruleId: [ruleId],
    });
    return {
      name: uuid,
      value: uuid,
    };
  }

  requestInBackground<T>(url: string, options: RequestInBackgroundOptions) {
    return request<T>(url, options);
  }

  async changeUrl(url: string, query: WebBlockHeader): Promise<string> {
    return queryString.stringifyUrl({ url, query: { [query.name]: query.value } });
  }

  async end(webBlockHeader: WebBlockHeader): Promise<void> {
    const handler = this.handlerMap.get(webBlockHeader.value);
    if (!handler) {
      return;
    }
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [],
      removeRuleIds: handler.ruleId,
    });
  }
}
