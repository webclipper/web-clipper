export interface BrowserTab {
  title: string;
  url: string;
}

interface BrowserService {
  getCurrentTab(): Promise<BrowserTab>;
}

class ChromeBrowserService implements BrowserService {
  getCurrentTab = async () => {
    return new Promise<BrowserTab>(resolve => {
      chrome.tabs.getCurrent((tab: any) => {
        resolve(tab);
      });
    });
  };
}

export default new ChromeBrowserService() as BrowserService;
