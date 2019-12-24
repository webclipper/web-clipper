import { AnyAction } from 'dva-model-creator';
import * as browser from '@web-clipper/chrome-promise';

export interface BrowserTab {
  title: string;
  url: string;
}

class ChromeBrowserService {
  sendActionToCurrentTab = async function<T>(action: AnyAction): Promise<T> {
    const current = await browser.tabs.getCurrent();
    if (!current || !current.id) {
      throw new Error('No Tab');
    }
    return browser.tabs.sendMessage(current.id, action);
  };
}

export default new ChromeBrowserService();
