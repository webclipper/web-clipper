import 'regenerator-runtime/runtime';
import 'reflect-metadata';
import Container from 'typedi';
import { IPermissionsService } from '@/service/common/permissions';
import { PermissionsChannelClient } from '@/service/permissions/common/permissionsIpc';
import { ITabService } from '@/service/common/tab';
import { PopupIpcClient } from '@/service/rpc/browser/popup/rpcClient';
import '@/service/config/browser/configService';
import '@/service/powerpackService';
import { TabChannelClient } from '@/service/tab/common/tabIpc';
import app from '@/pages/app';

const ipcClient = new PopupIpcClient();

const tabChanel = ipcClient.getChannel('tab');
Container.set(ITabService, new TabChannelClient(tabChanel));

const permissionsChannel = ipcClient.getChannel('permissions');
Container.set(IPermissionsService, new PermissionsChannelClient(permissionsChannel));

app();
