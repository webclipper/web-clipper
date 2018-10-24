import { DocumentInfo } from './../../../../dist/js/lib/services/common/contentScripttool/index.d';
import { ActionMessageType } from './../../../enums/actionMessageType';

export interface DocumentInfo {
  title: string;
  url: string;
}

export interface ContentScriptTool {
  toggleClipperTool(): void;
  getDocumentInfo(): Promise<DocumentInfo>;
  cleanElement(): Promise<void>;
  getFullPage(): Promise<string>;
  getReadabilityContent(): Promise<string>;
  getSelectElement(): Promise<string>;
}

export class ContentScriptToolImpl implements ContentScriptTool {
  public toggleClipperTool() {
    chrome.tabs.getCurrent((tab: any) => {
      chrome.tabs.sendMessage(tab.id, {
        action: ActionMessageType.ICON_CLICK,
      });
    });
  }
  public async getDocumentInfo() {
    return gerResult<DocumentInfo>(ActionMessageType.GET_DOCUMENT_INFO);
  }
  public async cleanElement() {
    return gerResult<void>(ActionMessageType.CLEAN_SELECT_ITEM);
  }
  public async getFullPage() {
    return gerResult<string>(ActionMessageType.GET_FULL_PAGE_MARKDOWN);

  }
  public async getReadabilityContent() {
    return gerResult<string>(ActionMessageType.GET_READABILITY_MARKDOWN);
  }
  public async getSelectElement() {
    return gerResult<string>(ActionMessageType.GET_SELECT_ITEM);
  }
}

const gerResult = function <T>(message: ActionMessageType): Promise<T> {
  return new Promise<T>((resolve, _) => {
    chrome.tabs.getCurrent((tab: any) => {
      chrome.tabs.sendMessage(tab.id, {
        action: message
      }, (re: T) => {
        resolve(re);
      });
    });
  });
};

