import { ITabService, CaptureVisibleTabOptions } from '@/service/common/tab';
import * as browser from '@web-clipper/chrome-promise';
import { Service } from 'typedi';

class ChromeTabService implements ITabService {
  getCurrent() {
    return browser.tabs.getCurrent();
  }

  remove(tabId: number): Promise<void> {
    return browser.tabs.remove(tabId) as Promise<void>;
  }

  captureVisibleTab(option: CaptureVisibleTabOptions | number) {
    return browser.tabs.captureVisibleTab(option);
  }
}

Service(ITabService)(ChromeTabService);
