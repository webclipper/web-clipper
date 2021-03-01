import { getLocaleExtensionManifest } from '@web-clipper/extensions';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/types';
import { IExtensionWithId } from '@/extensions/common';
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

  constructor(@Inject(ILocalStorageService) private localStorageService: IStorageService) {
    this.init();
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
    const internalExtensions = extensions.map(e => ({
      ...e,
      manifest: getLocaleExtensionManifest(e.manifest, locale),
    }));
    this.extensions = internalExtensions;
    this.contextMenus = contextMenus;
  }
}

Service(IExtensionContainer)(ExtensionContainer);
