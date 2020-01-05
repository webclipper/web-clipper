import { IChannelClient, ChannelClient } from './../../../common/rpc';

export class PopupIpcClient implements IChannelClient {
  getChannel(channelName: string) {
    return new ChannelClient(
      chrome.runtime.connect({
        name: channelName,
      })
    );
  }
}
