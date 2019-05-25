export interface ITabs {
  executeScript<T>(tabId: number, details: chrome.tabs.InjectDetails): Promise<T[]>;
}

class ChromeTabs implements ITabs {
  public executeScript = async <T>(tabId: number, details: chrome.tabs.InjectDetails) => {
    return new Promise<T[]>(resolve => {
      chrome.tabs.executeScript(tabId, details, resolve);
    });
  };
}

export default new ChromeTabs();
