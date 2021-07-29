import { IStorageService } from '@web-clipper/shared/lib/storage';
import { Inject } from 'typedi';
import { ILocalStorageService } from './../common/storage';
import { IConfigurationService } from '@/service/common/configuration';

export class ConfigurationService implements IConfigurationService {
  private _initialized: Promise<void> | null = null;
  constructor(@Inject(ILocalStorageService) private localStorageService: IStorageService) {
    //
  }

  public async init(): Promise<void> {
    if (!this._initialized) {
      this._initialized = this.doInitialize();
    }
    return this._initialized;
  }

  private async doInitialize(): Promise<void> {
    await this.localStorageService.init();
  }
}
