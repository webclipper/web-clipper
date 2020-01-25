import { ITabService } from '@/service/common/tab';
import { IChannelClient, ChannelClient, IChannel, IPCMessageRequest } from '@/service/common/ipc';

export class PopupIpcClient implements IChannelClient {
  getChannel(channelName: string) {
    return new ChannelClient(
      chrome.runtime.connect({
        name: channelName,
      })
    );
  }
}

export class PopupContentScriptChannelClient implements IChannel {
  constructor(private namespace: string, private tabService: ITabService) {}

  call<T>(command: string, arg?: any): Promise<T> {
    const action: IPCMessageRequest = {
      uuid: this.namespace,
      command,
      arg,
    };
    return this.tabService.sendActionToCurrentTab(action);
  }
}

export class PopupContentScriptIPCClient implements IChannelClient {
  constructor(private tabService: ITabService) {}
  getChannel(channelName: string) {
    return new PopupContentScriptChannelClient(channelName, this.tabService);
  }
}
