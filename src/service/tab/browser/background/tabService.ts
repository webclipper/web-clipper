import { ITabService, CaptureVisibleTabOptions, AbstractTabService } from '@/service/common/tab';
import * as browser from '@web-clipper/chrome-promise';
import { Service } from 'typedi';

class ChromeTabService extends AbstractTabService {
  getCurrent() {
    return browser.tabs.getCurrent();
  }

  remove(tabId: number): Promise<void> {
    return browser.tabs.remove(tabId) as Promise<void>;
  }

  captureVisibleTab(option: CaptureVisibleTabOptions | number) {
    return browser.tabs.captureVisibleTab(option);
  }

  sendMessage<T>(tabId: number, message: any): Promise<T> {
    return browser.tabs.sendMessage<T>(tabId, message);
  }
}

Service(ITabService)(ChromeTabService);
