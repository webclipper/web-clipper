import { IChannelClient, ChannelClient } from '@/service/common/ipc';

export class PopupIpcClient implements IChannelClient {
  getChannel(channelName: string) {
    return new ChannelClient(
      chrome.runtime.connect({
        name: channelName,
      })
    );
  }
}
