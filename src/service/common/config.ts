import { Token } from 'typedi';

export interface RemoteConfig {
  iconfont: string;
  chromeWebStoreVersion: string;
}

export interface IConfigService {
  config?: RemoteConfig;

  isLatestVersion: boolean;

  load(): Promise<void>;
}

export const IConfigService = new Token<IConfigService>();
