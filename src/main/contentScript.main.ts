import 'regenerator-runtime/runtime';
import 'reflect-metadata';
import { IChannelServer } from '@/service/common/ipc';
import { ContentScriptChannel } from '@/service/contentScript/common/contentScriptIPC';
import Container from 'typedi';
import { IContentScriptService } from '@/service/common/contentScript';
import '@/service/contentScript/browser/contentScript/contentScript';
import { ContentScriptIPCServer } from '@/service/ipc/browser/contentScript/contentScriptIPCServer';

const backgroundIPCServer: IChannelServer = new ContentScriptIPCServer();
backgroundIPCServer.registerChannel(
  'contentScript',
  new ContentScriptChannel(Container.get(IContentScriptService))
);
