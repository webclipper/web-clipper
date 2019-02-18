import { clickIcon, doYouAliveNow } from '../store/actions/browser';
import { sendActionByTabId } from '../utils/browser';

if (process.env.NODE_ENV === 'development') {
  chrome.browserAction.setIcon({ path: 'icons/yuque-dev.png' });
}

chrome.browserAction.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  const tabId = tab.id;
  if (!tabId) {
    alert('暂时无法剪辑此类型的页面。');
    return;
  }
  const status = await sendActionByTabId(tabId, doYouAliveNow());
  if (!status) {
    chrome.tabs.executeScript(tabId, { file: 'js/content_script.js' }, () => {
      if (chrome.runtime.lastError) {
        alert('暂时无法剪辑此类型的页面。');
        return;
      }
      sendActionByTabId(tabId, clickIcon());
      return;
    });
  }
  sendActionByTabId(tabId, clickIcon());
});
