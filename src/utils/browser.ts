import { AnyAction } from 'typescript-fsa';

export const sendActionToCurrentTab = function<T>(
  action: AnyAction
): Promise<T> {
  return new Promise<T>((resolve, _) => {
    chrome.tabs.getCurrent((tab: chrome.tabs.Tab) => {
      chrome.tabs.sendMessage(tab.id!, action, (re: T) => {
        resolve(re);
      });
    });
  });
};
