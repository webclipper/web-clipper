import { AnyAction } from 'dva-model-creator';
import ChromeBrowserAction, { IBrowserAction } from './browserAction';
import ChromeTabs, { ITabs } from './tabs';

export interface BrowserTab {
  title: string;
  url: string;
}

interface BrowserService {
  browserAction: IBrowserAction;

  tabs: ITabs;

  getCurrentTab(): Promise<BrowserTab>;

  sendActionByTabId<T>(tabId: number, action: AnyAction): Promise<T>;

  sendActionToCurrentTab<T>(action: AnyAction): Promise<T>;

  getCookie(option: { url: string; name: string }): Promise<string>;

  captureVisibleTab(): Promise<string>;
}

class ChromeBrowserService implements BrowserService {
  public readonly browserAction: IBrowserAction;
  public readonly tabs: ITabs;

  constructor() {
    this.browserAction = ChromeBrowserAction;
    this.tabs = ChromeTabs;
  }

  getCurrentTab = async () => {
    return new Promise<BrowserTab>(resolve => {
      chrome.tabs.getCurrent((tab: any) => {
        resolve(tab);
      });
    });
  };

  sendActionByTabId = function<T>(tabId: number, action: AnyAction): Promise<T> {
    return new Promise<T>(resolve => {
      chrome.tabs.sendMessage(tabId, action, (re: T) => {
        resolve(re);
      });
    });
  };

  getCookie = async (option: { url: string; name: string }) => {
    return new Promise<string>(resolve => {
      chrome.cookies.get(
        {
          url: option.url,
          name: option.name,
        },
        cookie => {
          if (cookie != null) {
            resolve(cookie.value);
          }
        }
      );
    });
  };

  sendActionToCurrentTab = function<T>(action: AnyAction): Promise<T> {
    return new Promise<T>(resolve => {
      chrome.tabs.getCurrent((tab?: chrome.tabs.Tab) => {
        if (tab) {
          chrome.tabs.sendMessage(tab.id!, action, (re: T) => {
            resolve(re);
          });
        }
      });
    });
  };

  captureVisibleTab = async () => {
    return new Promise<string>(resolve => {
      chrome.tabs.captureVisibleTab(image => {
        resolve(image);
      });
    });
  };
}

export default new ChromeBrowserService() as BrowserService;
