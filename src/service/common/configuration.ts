export interface WebClipperConfiguration {
  resource: {
    host: string;
    privacy: string;
    changelog: string;
  };
  yuque_oauth: {
    clientId: string;
    callback: string;
    scope: string;
  };
  onenote_oauth: {
    clientId: string;
    callback: string;
  };
  google_oauth: {
    clientId: string;
    callback: string;
  };
  github_oauth: {
    clientId: string;
    callback: string;
  };
}

export interface IConfigurationService {}
