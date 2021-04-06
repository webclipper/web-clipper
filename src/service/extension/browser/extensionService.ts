import {
  LOCAL_EXTENSIONS_DISABLED_AUTOMATIC_EXTENSIONS_KEY,
  LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY,
} from '@/common/modelTypes/extensions';
import { IStorageService } from '@web-clipper/shared/lib/storage';
import { ILocalStorageService, ISyncStorageService } from '@/service/common/storage';
import { Service, Inject } from 'typedi';
import { IExtensionService } from '@/service/common/extension';
import { observable } from 'mobx';

class ExtensionService implements IExtensionService {
  @observable
  public DefaultExtensionId: string | null = null;

  @observable
  public DisabledExtensionIds: string[] = [];

  @observable
  public DisabledAutomaticExtensionIds: string[] = [];

  constructor(
    @Inject(ILocalStorageService) private localStorageService: IStorageService,
    @Inject(ISyncStorageService) private syncStorageService: IStorageService
  ) {
    this.init();
    this.syncStorageService.onDidChangeStorage(e => {
      if (['defaultPluginId'].includes(e)) {
        this.init();
      }
    });
    this.localStorageService.onDidChangeStorage(e => {
      if (
        [
          LOCAL_EXTENSIONS_DISABLED_AUTOMATIC_EXTENSIONS_KEY,
          LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY,
        ].includes(e)
      ) {
        this.init();
      }
    });
  }

  getExtensionConfig<T>(id: string): T | undefined {
    const config = this.localStorageService.get('extensionConfig', '{}');
    if (JSON.parse(config)[id]) {
      return JSON.parse(JSON.parse(config)[id]);
    }
    return;
  }

  async setExtensionConfig(id: string, data: any): Promise<void> {
    const config = JSON.parse(this.localStorageService.get('extensionConfig', '{}'));
    config[id] = JSON.stringify(data);
    await this.localStorageService.set('extensionConfig', JSON.stringify(config));
  }

  async toggleDefault(id: string) {
    if (this.DefaultExtensionId === id) {
      await this.syncStorageService.delete('defaultPluginId');
      return;
    }
    await this.syncStorageService.set('defaultPluginId', id);
  }

  async toggleDisableExtension(id: string) {
    await this.toggleStorageData(LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY, id);
  }

  async toggleAutomaticExtension(id: string) {
    await this.toggleStorageData(LOCAL_EXTENSIONS_DISABLED_AUTOMATIC_EXTENSIONS_KEY, id);
  }

  private async toggleStorageData(key: string, id: string) {
    let extensions = JSON.parse(this.localStorageService.get(key, '[]')) as string[];
    const newExtensions = extensions.filter(o => o !== id);
    if (newExtensions.length === extensions.length) {
      newExtensions.push(id);
    }
    await this.localStorageService.set(key, JSON.stringify(newExtensions));
  }

  private init() {
    const DefaultExtensionId = this.syncStorageService.get('defaultPluginId');
    this.DefaultExtensionId = DefaultExtensionId ?? null;

    this.DisabledExtensionIds = JSON.parse(
      this.localStorageService.get(LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY, '[]')
    ) as string[];

    this.DisabledAutomaticExtensionIds = JSON.parse(
      this.localStorageService.get(LOCAL_EXTENSIONS_DISABLED_AUTOMATIC_EXTENSIONS_KEY, '[]')
    ) as string[];
  }
}

Service(IExtensionService)(ExtensionService);
