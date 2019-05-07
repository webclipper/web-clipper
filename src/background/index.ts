import browser from 'common/browser';
import { clickIcon, doYouAliveNow } from 'actions';

if (process.env.NODE_ENV === 'development') {
  browser.browserAction.setIcon({ path: 'icons/yuque-dev.png' });
}

chrome.browserAction.onClicked.addListener(async tab => {
  const tabId = tab.id;
  if (!tabId) {
    alert('暂时无法剪辑此类型的页面。');
    return;
  }
  const status = await browser.sendActionByTabId(tabId, doYouAliveNow());
  if (!status) {
    await browser.tabs.executeScript(tabId, {
      file: 'js/content_script.js',
    });
    if (chrome.runtime.lastError) {
      alert('暂时无法剪辑此类型的页面。');
      return;
    }
  }
  browser.sendActionByTabId(tabId, clickIcon());
});
