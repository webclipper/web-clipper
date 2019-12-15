import { hasUpdate } from '@/common/version';
import config from '@/config';
import { IConfigService, RemoteConfig } from '@/service/common/config';
import { Service } from 'typedi';
import packageJson from '@/../package.json';
import { observable } from 'mobx';
import request from 'umi-request';

class ConfigService implements IConfigService {
  @observable
  public isLatestVersion: boolean = false;

  @observable
  public config?: RemoteConfig;

  public readonly localVersion = packageJson.version;

  load = async () => {
    try {
      const response = await request.get<RemoteConfig>(`${config.resourceHost}/config.json`);
      this.config = response;
      this.isLatestVersion = !hasUpdate(response.chromeWebStoreVersion, this.localVersion);
    } catch (_error) {
      console.log('Load Config Error');
    }
  };
}

Service(IConfigService)(ConfigService);
