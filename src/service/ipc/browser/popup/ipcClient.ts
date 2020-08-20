import { SerializedError } from '@/common/error';
import { ITabService } from '@/service/common/tab';
import {
  IChannelClient,
  ChannelClient,
  IChannel,
  IPCMessageRequest,
  IPCMessageResponse,
} from '@/service/common/ipc';

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

  async call<T>(command: string, arg?: any): Promise<T> {
    const action: IPCMessageRequest = {
      uuid: this.namespace,
      command,
      arg,
    };
    const message: IPCMessageResponse<T> = await this.tabService.sendActionToCurrentTab(action);
    if (!message) {
      return Promise.reject(
        new Error(chrome.runtime.lastError?.message ?? 'ContentScript not ready yet.')
      );
    }
    return new Promise((resolve, reject) => {
      if (message.error) {
        const errorData: SerializedError = message.error.data;
        if (errorData.$isError) {
          const error = new Error(errorData.message);
          error.name = errorData.name;
          error.stack = errorData.stack;
          reject(error);
        } else {
          reject(message.error.data);
        }
        return;
      }
      if (message.result) {
        resolve(message.result.data);
        return;
      }
    });
  }
}

export class PopupContentScriptIPCClient implements IChannelClient {
  constructor(private tabService: ITabService) {}
  getChannel(channelName: string) {
    return new PopupContentScriptChannelClient(channelName, this.tabService);
  }
}
