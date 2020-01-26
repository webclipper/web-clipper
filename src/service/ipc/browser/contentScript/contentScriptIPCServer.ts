import {
  IChannelServer,
  IServerChannel,
  IPCMessageRequest,
  IPCMessageResponse,
} from '@/service/common/ipc';
import { transformErrorForSerialization } from '@/common/error';

export class ContentScriptIPCServer implements IChannelServer {
  public registerChannel(
    channelName: string,
    server: IServerChannel<chrome.runtime.MessageSender>
  ) {
    const uuid = channelName;
    chrome.runtime.onMessage.addListener(
      (message: IPCMessageRequest, sender: chrome.runtime.MessageSender, sendResponse) => {
        if (message.uuid !== uuid) {
          return;
        }
        (async () => {
          let response: IPCMessageResponse;
          try {
            const result = await server.call(sender, message.command, message.arg);
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
          sendResponse(response);
        })();
        return true;
      }
    );
  }
}
