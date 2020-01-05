import 'regenerator-runtime/runtime';
import 'reflect-metadata';
import { ITabService } from '@/service/common/tab';
import { IChannelServer } from '@/service/common/rpc';
import { BackgroundIPCServer } from '@/service/rpc/browser/background-main/rpcService';
import { TabChannel } from '@/service/tab/common/tabIpc';
import Container from 'typedi';
import '@/service/tab/browser/background/tabService';

const backgroundIPCServer: IChannelServer = new BackgroundIPCServer();

backgroundIPCServer.registerChannel('tab', new TabChannel(Container.get(ITabService)));
