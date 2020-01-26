import {
  ITabService,
  CaptureVisibleTabOptions,
  AbstractTabService,
  Tab,
} from '@/service/common/tab';
import * as browser from '@web-clipper/chrome-promise';
import { Service } from 'typedi';

class ChromeTabService extends AbstractTabService {
  getCurrent() {
    return new Promise<Tab>(r => {
      chrome.tabs.query(
        {
          currentWindow: true,
          active: true,
        },
        tab => r(tab[0])
      );
    });
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

  create(createProperties: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> {
    return new Promise<chrome.tabs.Tab>(r => {
      chrome.tabs.create(createProperties, tab => {
        r(tab);
      });
    });
  }
}

Service(ITabService)(ChromeTabService);
