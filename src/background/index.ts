import { ActionMessage } from '../model/Message';
import { ActionMessageType } from '../enums';

if (process.env.NODE_ENV === 'development') {
  chrome.browserAction.setIcon({ path: 'icons/yuque-dev.png' });
}

async function tabStatus(tabId: number): Promise<any> {
  return new Promise((resolve, _) => {
    const massage: ActionMessage = {
      action: ActionMessageType.DO_YOU_ALIVE_NOW
    };
    chrome.tabs.sendMessage(tabId, massage, (cb: boolean) => {
      if (!cb) {
        resolve(false);
      }
      resolve(true);
    });
  });
}

chrome.browserAction.onClicked.addListener(async (tab: any) => {
  if (!(await tabStatus(tab.id))) {
    chrome.tabs.executeScript(tab.id, { file: 'js/content_script.js' }, () => {
      if (chrome.runtime.lastError) {
        alert('暂时无法剪辑此类型的页面。');
        return;
      }
      const massage: ActionMessage = {
        action: ActionMessageType.ICON_CLICK
      };
      chrome.tabs.sendMessage(tab.id, massage);
      return;
    });
  }
  const massage: ActionMessage = {
    action: ActionMessageType.ICON_CLICK
  };
  chrome.tabs.sendMessage(tab.id, massage);
});
