import * as browser from '@web-clipper/chrome-promise';
import { clickIcon, doYouAliveNow } from 'browserActions/browser';
import config from '@/config';

browser.browserAction.setIcon({ path: config.icon });

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
