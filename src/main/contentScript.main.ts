import { localStorageService, syncStorageService } from '@/common/chrome/storage';
import { ILocalStorageService, ISyncStorageService } from '@/service/common/storage';
import 'regenerator-runtime/runtime';
import 'reflect-metadata';
import { IChannelServer } from '@/service/common/ipc';
import { ContentScriptChannel } from '@/service/contentScript/common/contentScriptIPC';
import Container from 'typedi';
import '@/service/extension/browser/extensionContainer';
import { IContentScriptService } from '@/service/common/contentScript';
import '@/service/contentScript/browser/contentScript/contentScript';
import { ContentScriptIPCServer } from '@/service/ipc/browser/contentScript/contentScriptIPCServer';

Container.set(ILocalStorageService, localStorageService);
Container.set(ISyncStorageService, syncStorageService);

const backgroundIPCServer: IChannelServer = new ContentScriptIPCServer();
backgroundIPCServer.registerChannel(
  'contentScript',
  new ContentScriptChannel(Container.get(IContentScriptService))
);
