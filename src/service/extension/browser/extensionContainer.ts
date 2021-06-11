import { ILocaleService } from './../../common/locale';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/types';
import { getLocaleExtensionManifest, IExtensionWithId } from '@/extensions/common';
import { extensions, contextMenus } from '@/extensions';
import { IStorageService } from '@web-clipper/shared/lib/storage';
import { ILocalStorageService } from '@/service/common/storage';
import { Service, Inject } from 'typedi';
import { IExtensionContainer } from '@/service/common/extension';
import { observable } from 'mobx';
import { IContextMenusWithId } from '@/extensions/contextMenus';

class ExtensionContainer implements IExtensionContainer {
  @observable
  public extensions: IExtensionWithId[] = [];

  @observable
  public contextMenus: IContextMenusWithId[] = [];

  constructor(
    @Inject(ILocalStorageService) private localStorageService: IStorageService,
    @Inject(ILocaleService) localeService: ILocaleService
  ) {
    localeService.init().then(() => {
      this.init();
    });
    this.localStorageService.onDidChangeStorage(e => {
      if (e === LOCAL_USER_PREFERENCE_LOCALE_KEY) {
        this.init();
      }
    });
  }

  private init() {
    const locale = this.localStorageService.get(
      LOCAL_USER_PREFERENCE_LOCALE_KEY,
      navigator.language
    );
    const internalExtensions = extensions.map(e => {
      let extensionInstance: any = e;
      if (e.factory) {
        const Factory = e.factory;
        extensionInstance = { ...e, ...new Factory() };
      }
      return {
        ...extensionInstance,
        manifest: getLocaleExtensionManifest(extensionInstance.manifest, locale),
      };
    });
    this.extensions = internalExtensions;
    this.contextMenus = contextMenus;
  }
}

Service(IExtensionContainer)(ExtensionContainer);
