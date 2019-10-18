import * as browser from '@web-clipper/chrome-promise';
import { clickIcon, doYouAliveNow } from 'browserActions/browser';
import config from '@/config';
import { MessageListenerCombiner } from '@web-clipper/message-listener-combiner';
import { closeCurrentTab } from '../actions/message';

browser.browserAction.setIcon({ path: config.icon });

const listeners = new MessageListenerCombiner().case(
  closeCurrentTab,
  async (_payload, _sender, _sendResponse) => {
    if (_sender.tab && _sender.tab.id) {
      chrome.tabs.remove(_sender.tab.id);
    }
    return _sendResponse(true);
  }
);

browser.runtime.onMessage.addListener(listeners.handle);

browser.browserAction.onClicked.addListener(async tab => {
  const tabId = tab.id;
  if (!tabId) {
    alert('暂时无法剪辑此类型的页面。');
    return;
  }
  const status = await browser.tabs.sendMessage<boolean>(tabId, doYouAliveNow());
  if (!status) {
    await browser.tabs.executeScript(
      {
        file: 'content_script.js',
      },
      tabId
    );
    if (browser.runtime.lastError) {
      alert('暂时无法剪辑此类型的页面。');
      return;
    }
  }
  browser.tabs.sendMessage(tabId, clickIcon());
});
