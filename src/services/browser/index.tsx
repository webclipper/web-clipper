import { AnyAction } from 'typescript-fsa';

export interface BrowserTab {
  title: string;
  url: string;
}

interface BrowserService {
  getCurrentTab(): Promise<BrowserTab>;

  sendActionByTabId<T>(tabId: number, action: AnyAction): Promise<T>;

  sendActionToCurrentTab<T>(action: AnyAction): Promise<T>;
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

  sendActionToCurrentTab = function<T>(action: AnyAction): Promise<T> {
    return new Promise<T>((resolve, _) => {
      chrome.tabs.getCurrent((tab: chrome.tabs.Tab) => {
        chrome.tabs.sendMessage(tab.id!, action, (re: T) => {
          resolve(re);
        });
      });
    });
  };
}

export default new ChromeBrowserService() as BrowserService;
