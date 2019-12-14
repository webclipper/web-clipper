import * as browser from '@web-clipper/chrome-promise';
import { clickIcon } from 'browserActions/browser';
import config from '@/config';
import { MessageListenerCombiner } from '@web-clipper/message-listener-combiner';
import { closeCurrentTab } from '../actions/message';
import { initGa, trackEvent } from '@/common/gs';
import packageJson from '@/../package.json';

initGa();

const media = window.matchMedia('(prefers-color-scheme: dark)');
browser.browserAction.setIcon({ path: media.matches ? config.iconDark : config.icon });

const listeners = new MessageListenerCombiner().case(
  closeCurrentTab,
  async (_payload, _sender, _sendResponse) => {
    if (_sender.tab && _sender.tab.id) {
      let id = _sender.tab.id;
      setTimeout(() => {
        chrome.tabs.remove(id);
      }, 1000);
    }
  }
);

browser.runtime.onMessage.addListener(listeners.handle);

browser.browserAction.onClicked.addListener(async tab => {
  const tabId = tab.id;
  if (!tabId) {
    trackEvent('Load_Web_Clipper', packageJson.version, 'error');
    alert(
      'Clipping of this type of page is temporarily unavailable.\n\n暂时无法剪辑此类型的页面。'
    );
    return;
  }
  trackEvent('Load_Web_Clipper', packageJson.version, 'success');
  await browser.tabs.executeScript(
    {
      file: 'content_script.js',
    },
    tabId
  );
  if (browser.runtime.lastError) {
    alert(
      'Clipping of this type of page is temporarily unavailable.\n\n暂时无法剪辑此类型的页面。'
    );
    return;
  }
  browser.tabs.sendMessage(tabId, clickIcon());
});
