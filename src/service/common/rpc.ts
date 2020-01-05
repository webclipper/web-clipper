import { generateUuid } from '@web-clipper/shared/lib/uuid';
import { SerializedError } from '@/common/error';

export interface IServerChannel<C = any> {
  call<T = any>(context: C, command: string, arg?: any): Promise<T>;
}

export interface IChannel {
  call<T>(command: string, arg?: any): Promise<T>;
}

export interface IChannelClient {
  getChannel(channelName: string): IChannel;
}

export interface IChannelServer {
  registerChannel(channelName: string, channel: IServerChannel): void;
}

export interface IPCMessageRequest<T = any> {
  uuid: string;
  command: string;
  arg?: T;
}

export interface IPCMessageResponse<T = any> {
  uuid: string;
  result?: {
    data: T;
  };
  error?: {
    data: SerializedError;
  };
}

export class ChannelClient implements IChannel {
  private port: chrome.runtime.Port;
  constructor(port: chrome.runtime.Port) {
    this.port = port;
  }

  call<T>(command: string, arg?: any): Promise<T> {
    const uuid = generateUuid();
    this.port.postMessage({
      uuid,
      command: command,
      arg,
    });
    return new Promise<T>((resolve, reject) => {
      const handler = (message: IPCMessageResponse) => {
        if (message.uuid !== uuid) {
          return;
        }
        this.port.onMessage.removeListener(handler);
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
      };
      this.port.onMessage.addListener(handler);
    });
  }
}
