import { hasUpdate } from '@/common/version';
import config from '@/config';
import { RemoteConfig as _RemoteConfig, IConfigService } from '@/service/common/config';
import { Service } from 'typedi';
import packageJson from '@/../package.json';
import localConfig from '@/../config.json';
import { observable, ObservableSet, runInAction } from 'mobx';
import request from 'umi-request';
import * as browser from '@web-clipper/chrome-promise';

type RemoteConfig = _RemoteConfig;

class BrowserConfigService implements IConfigService {
  @observable
  public isLatestVersion: boolean = true;

  @observable
  public config: RemoteConfig = localConfig;

  @observable
  public remoteIconSet: ObservableSet<string> = observable.set<string>();

  public readonly localVersion = packageJson.version;

  load = async () => {
    try {
      if (config.loadRemoteConfig) {
        this.config = await request.get<RemoteConfig>(`${config.resourceHost}/config.json`);
      }
      runInAction(() => {
        this.isLatestVersion = !hasUpdate(this.config.chromeWebStoreVersion, this.localVersion);
      });
      const iconsFile = await request.get('/icon.js');
      const matchResult: string[] = iconsFile.match(/id="([A-Za-z]+)"/g) || [];
      const remoteIcons = matchResult.map(o => o.match(/id="([A-Za-z]+)"/)![1]);
      runInAction(() => {
        remoteIcons.forEach(icon => {
          this.remoteIconSet.add(icon);
        });
      });
    } catch (_error) {
      console.log('Load Config Error');
    }
  };

  get id() {
    const url = browser.extension.getURL('tool.html');
    const match = /(chrome-extension|moz-extension):\/\/(.*)\/tool.html/.exec(url);
    if (!match) {
      throw new Error('Get ExtensionId failed');
    }
    return match[2];
  }
}

Service(IConfigService)(BrowserConfigService);
