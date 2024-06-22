import { transformErrorForSerialization } from '@/common/error';
import { IChannelServer, IServerChannel } from '@/service/common/ipc';

export class BackgroundIPCServer implements IChannelServer {
  public registerChannel(channelName: string, server: IServerChannel) {
    chrome.runtime.onMessage.addListener((message: any, _sender, sendResponse) => {
      if (channelName !== message.channelName) {
        return false;
      }
      const { uuid, command, arg } = message;
      server
        .callCommand(_sender, command, arg)
        .then((result) => {
          sendResponse({
            uuid,
            result: { data: result },
          });
        })
        .catch((error) => {
          sendResponse({
            uuid,
            error: { data: transformErrorForSerialization(error) },
          });
        });
      return true;
    });
  }
}
