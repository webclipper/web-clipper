import { AnyAction } from 'dva-model-creator';
import * as browser from '@web-clipper/chrome-promise';

export interface BrowserTab {
  title: string;
  url: string;
}

class ChromeBrowserService {
  getCookie = async (option: { url: string; name: string }) => {
    const cookie = await browser.cookies.get({
      url: option.url,
      name: option.name,
    });
    if (!cookie) {
      return null;
    }
    return cookie.value;
  };

  sendActionToCurrentTab = async function<T>(action: AnyAction): Promise<T> {
    const current = await browser.tabs.getCurrent();
    if (!current || !current.id) {
      throw new Error('No Tab');
    }
    return browser.tabs.sendMessage(current.id, action);
  };

  captureVisibleTab = async () => {
    return new Promise<string>(resolve => {
      chrome.tabs.captureVisibleTab(image => {
        resolve(image);
      });
    });
  };
}

export default new ChromeBrowserService();
