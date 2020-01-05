import { ITabService } from './common/tab';
import { PopupIpcClient } from './rpc/browser/popup/rpcClient';
import '@/service/config/browser/configService';
import '@/service/permissionsService';
import '@/service/powerpackService';
import Container from 'typedi';
import { TabChannelClient } from '@/service/tab/common/tabIpc';

const ipcClient = new PopupIpcClient();

const tabChanel = ipcClient.getChannel('tab');

Container.set(ITabService, new TabChannelClient(tabChanel));
