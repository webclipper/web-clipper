import { AnyAction } from 'typescript-fsa';

export interface BrowserTab {
  title: string;
  url: string;
}

interface BrowserService {
  getCurrentTab(): Promise<BrowserTab>;

  sendActionByTabId<T>(tabId: number, action: AnyAction): Promise<T>;

  sendActionToCurrentTab<T>(action: AnyAction): Promise<T>;

  getCookie(option: { url: string; name: string }): Promise<string>;

  captureVisibleTab(): Promise<string>;
}

class ChromeBrowserService implements BrowserService {
  getCurrentTab = async () => {
    return new Promise<BrowserTab>(resolve => {
      chrome.tabs.getCurrent((tab: any) => {
        resolve(tab);
      });
    });
  };

  sendActionByTabId = function<T>(
    tabId: number,
    action: AnyAction
  ): Promise<T> {
    return new Promise<T>((resolve, _) => {
      chrome.tabs.sendMessage(tabId, action, (re: T) => {
        resolve(re);
      });
    });
  };

  getCookie = async (option: { url: string; name: string }) => {
    return new Promise<string>((resolve, _) => {
      chrome.cookies.get(
        {
          url: option.url,
          name: option.name
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
    return new Promise<T>((resolve, _) => {
      chrome.tabs.getCurrent((tab: chrome.tabs.Tab) => {
        chrome.tabs.sendMessage(tab.id!, action, (re: T) => {
          resolve(re);
        });
      });
    });
  };

  captureVisibleTab = async () => {
    return new Promise<string>((resolve, _) => {
      chrome.tabs.captureVisibleTab(image => {
        resolve(image);
      });
    });
  };
}

export default new ChromeBrowserService() as BrowserService;
