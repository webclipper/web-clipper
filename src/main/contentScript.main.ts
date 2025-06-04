import 'reflect-metadata';
import 'regenerator-runtime/runtime';

//

import { localStorageService, syncStorageService } from '@/common/chrome/storage';
import { ILocalStorageService, ISyncStorageService } from '@/service/common/storage';

import localeService from '@/common/locales';
import { IContentScriptService } from '@/service/common/contentScript';
import { IChannelServer } from '@/service/common/ipc';
import { ILocaleService } from '@/service/common/locale';
import '@/service/contentScript/browser/contentScript/contentScript';
import { ContentScriptChannel } from '@/service/contentScript/common/contentScriptIPC';
import '@/service/extension/browser/extensionContainer';
import { ContentScriptIPCServer } from '@/service/ipc/browser/contentScript/contentScriptIPCServer';
import { PopupIpcClient } from '@/service/ipc/browser/popup/ipcClient';
import { IWorkerService } from '@/service/worker/common';
import { WorkerServiceChannelClient } from '@/service/worker/common/workserServiceIPC';
import Container from 'typedi';

Container.set(ILocalStorageService, localStorageService);
Container.set(ISyncStorageService, syncStorageService);
Container.set(ILocaleService, localeService);

//
import { IPreferenceService } from '@/service/common/preference';
import '@/service/preference/browser/preferenceService';

localeService.init();

const backgroundIPCServer: IChannelServer = new ContentScriptIPCServer();
backgroundIPCServer.registerChannel(
  'contentScript',
  new ContentScriptChannel(Container.get(IContentScriptService))
);

(async () => {
  await Container.get(ISyncStorageService).init();
  updateColor();
  Container.get(ISyncStorageService).onDidChangeStorage(() => {
    updateColor();
  });
  updateMenu();
})();

const ipcClient = new PopupIpcClient();
const workerChannel = ipcClient.getChannel('worker');
Container.set(IWorkerService, new WorkerServiceChannelClient(workerChannel));

async function updateColor() {
  const preferenceService = Container.get(IPreferenceService);
  await preferenceService.init();
  Container.set(IWorkerService, new WorkerServiceChannelClient(workerChannel));
  const workerService = Container.get(IWorkerService);
  let iconColor = preferenceService.userPreference.iconColor;
  if (iconColor === 'auto') {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    iconColor = media.matches ? 'light' : 'dark';
  }
  workerService.changeIcon(iconColor);
}

async function updateMenu() {
  const workerService = Container.get(IWorkerService);

  workerService.initContextMenu();
}
