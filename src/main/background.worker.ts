import 'reflect-metadata';
import 'regenerator-runtime/runtime';

// services
import { IContentScriptService } from '@/service/common/contentScript';
import { ICookieService } from '@/service/common/cookie';
import { IChannelServer } from '@/service/common/ipc';
import { IPermissionsService } from '@/service/common/permissions';
import { ITabService } from '@/service/common/tab';
import { IWebRequestService } from '@/service/common/webRequest';
import { ContentScriptChannelClient } from '@/service/contentScript/common/contentScriptIPC';
import '@/service/cookie/background/cookieService';
import { CookieChannel } from '@/service/cookie/common/cookieIpc';
import { BackgroundIPCServer } from '@/service/ipc/browser/background-main/ipcService';
import { PopupContentScriptIPCClient } from '@/service/ipc/browser/popup/ipcClient';
import '@/service/permissions/chrome/permissionsService';
import { PermissionsChannel } from '@/service/permissions/common/permissionsIpc';
import '@/service/tab/browser/background/tabService';
import { TabChannel } from '@/service/tab/common/tabIpc';
import '@/service/webRequest/chrome/background/tabService';
import { WebRequestChannel } from '@/service/webRequest/common/webRequestIPC';
import Container from 'typedi';
import { WorkerServiceChannel } from '@/service/worker/common/workserServiceIPC';
import '@/service/worker/worker/workerService';
import { IWorkerService } from '@/service/worker/common';
import '@/service/extension/browser/extensionContainer';
import '@/service/extension/browser/extensionService';
import { ILocalStorageService } from '@/service/common/storage';
//
import { syncStorageService, localStorageService } from '@/common/chrome/storage';
Container.set(ILocalStorageService, localStorageService);
Container.set(ISyncStorageService, syncStorageService);
import { ISyncStorageService } from '@/service/common/storage';
//
import localeService from '@/common/locales';
import { ILocaleService } from '@/service/common/locale';
import { IExtensionContainer, IExtensionService } from '@/service/common/extension';
Container.set(ILocaleService, localeService);

function main() {
  const backgroundIPCServer: IChannelServer = new BackgroundIPCServer();
  backgroundIPCServer.registerChannel('tab', new TabChannel(Container.get(ITabService)));
  backgroundIPCServer.registerChannel(
    'worker',
    new WorkerServiceChannel(Container.get(IWorkerService))
  );
  const contentScriptIPCClient = new PopupContentScriptIPCClient(Container.get(ITabService));
  const contentScriptChannel = contentScriptIPCClient.getChannel('contentScript');
  Container.set(IContentScriptService, new ContentScriptChannelClient(contentScriptChannel));
  const contentScriptService = Container.get(IContentScriptService);
  chrome.action.onClicked.addListener((tab) => {
    if (!tab || !tab.id) {
      return;
    }
    contentScriptService
      .checkStatus()
      .then(() => {
        contentScriptService.toggle();
      })
      .catch((e) => {
        chrome.tabs.create({ url: `${chrome.runtime.getURL('error.html')}?message=${e.message}` });
      });
  });
  backgroundIPCServer.registerChannel(
    'permissions',
    new PermissionsChannel(Container.get(IPermissionsService))
  );

  backgroundIPCServer.registerChannel(
    'webRequest',
    new WebRequestChannel(Container.get(IWebRequestService))
  );

  backgroundIPCServer.registerChannel('cookies', new CookieChannel(Container.get(ICookieService)));

  chrome.contextMenus.onClicked.addListener(async (_info, tab) => {
    const extensionContainer = Container.get(IExtensionContainer);
    const extensionService = Container.get(IExtensionService);
    const contentScriptService = Container.get(IContentScriptService);
    await extensionContainer.init();
    await extensionService.init();
    const contextMenus = extensionContainer.contextMenus;
    const currentContextMenus = contextMenus.filter(
      (p) => !extensionService.DisabledExtensionIds.includes(p.id)
    );
    let config: unknown;
    const Menu = currentContextMenus.find((p) => p.id === _info.menuItemId)!;
    if (!Menu) {
      return;
    }
    const instance = new Menu.contextMenu();
    if (instance.manifest.extensionId) {
      config =
        extensionService.getExtensionConfig(instance.manifest.extensionId!) ||
        instance.manifest.config?.default;
    }
    instance.run(tab!, {
      config,
      contentScriptService,
    });
  });

  chrome.commands.onCommand.addListener(async (e) => {
    if (e === 'save-selection') {
      const extensionService = Container.get(IExtensionService);
      const extensionContainer = Container.get(IExtensionContainer);
      const contextMenus = extensionContainer.contextMenus;
      const currentContextMenus = contextMenus.filter(
        // eslint-disable-next-line max-nested-callbacks
        (p) => !extensionService.DisabledExtensionIds.includes(p.id)
      );
      for (const iterator of currentContextMenus) {
        const Factory = iterator.contextMenu;
        const instance = new Factory();
        if (iterator.id === 'contextMenus.selection.save') {
          let config: unknown;
          if (instance.manifest.extensionId) {
            config =
              extensionService.getExtensionConfig(instance.manifest.extensionId!) ||
              instance.manifest.config?.default;
          }
          instance.run((await Container.get(ITabService).getCurrent()) as any, {
            config,
            contentScriptService,
          });
        }
      }
    }
  });
}

try {
  main();
} catch (error) {
  console.log((error as Error).message);
  console.error(error);
}
