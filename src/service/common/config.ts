import { Token } from 'typedi';
import { ObservableSet } from 'mobx';

export interface RemoteConfig {
  iconfont: string;

  chromeWebStoreVersion: string;

  privacyLocale: string[];

  changelogLocale: string[];
}

export interface IConfigService {
  config?: RemoteConfig;

  isLatestVersion: boolean;

  readonly localVersion: string;

  remoteIconSet: ObservableSet<string>;

  id: string;

  load(): Promise<void>;
}

export const IConfigService = new Token<IConfigService>();
