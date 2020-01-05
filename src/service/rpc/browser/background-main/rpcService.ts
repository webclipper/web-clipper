import {
  IChannelServer,
  IServerChannel,
  IPCMessageRequest,
  IPCMessageResponse,
} from '@/service/common/rpc';
import { transformErrorForSerialization } from '@/common/error';

export class BackgroundIPCServer implements IChannelServer {
  public registerChannel(channelName: string, server: IServerChannel) {
    chrome.runtime.onConnect.addListener(port => {
      if (port.name !== channelName) {
        return;
      }
      port.onMessage.addListener(async (message: IPCMessageRequest) => {
        const { uuid, command, arg } = message;
        let response: IPCMessageResponse;
        try {
          const result = await server.call(command, arg);
          response = {
            uuid,
            result: { data: result },
          };
        } catch (error) {
          response = {
            uuid,
            error: { data: transformErrorForSerialization(error) },
          };
        }
        port.postMessage(response);
      });
    });
  }
}
