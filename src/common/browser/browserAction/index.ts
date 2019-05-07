export interface IBrowserAction {
  setIcon(details: chrome.browserAction.TabIconDetails): Promise<void>;
}

class ChromeBrowserService implements IBrowserAction {
  public setIcon = async (detail: chrome.browserAction.TabIconDetails) => {
    return new Promise<void>(resolve => {
      chrome.browserAction.setIcon(detail, resolve);
    });
  };
}

export default new ChromeBrowserService() as IBrowserAction;
