import browserService from '../common/browser';
import { clickIcon, doYouAliveNow } from '../store/actions/browser';

if (process.env.NODE_ENV === 'development') {
  chrome.browserAction.setIcon({ path: 'icons/yuque-dev.png' });
}

chrome.browserAction.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  const tabId = tab.id;
  if (!tabId) {
    alert('暂时无法剪辑此类型的页面。');
    return;
  }
  const status = await browserService.sendActionByTabId(tabId, doYouAliveNow());
  if (!status) {
    chrome.tabs.executeScript(tabId, { file: 'js/content_script.js' }, () => {
      if (chrome.runtime.lastError) {
        alert('暂时无法剪辑此类型的页面。');
        return;
      }
      browserService.sendActionByTabId(tabId, clickIcon());
      return;
    });
  }
  browserService.sendActionByTabId(tabId, clickIcon());
});
