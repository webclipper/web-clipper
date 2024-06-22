import { generateUuid } from '@web-clipper/shared/lib/uuid';
import { SerializedError } from '@/common/error';

export interface IServerChannel<C = any> {
  callCommand<T = any>(context: C, command: string, arg?: any): Promise<T>;
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
  constructor(private channelName: string) {}

  async call<T>(command: string, arg?: any): Promise<T> {
    const uuid = generateUuid();
    const response: any = await chrome.runtime.sendMessage({
      uuid,
      command: command,
      arg,
      channelName: this.channelName,
    });
    if (response.error) {
      const errorData: SerializedError = response.error.data;
      if (errorData.$isError) {
        const error = new Error(errorData.message);
        error.name = errorData.name;
        error.stack = errorData.stack;
        throw error;
      } else {
        throw response.error.data;
      }
    }
    if (response.result) {
      return response.result.data;
    }
    throw new Error('some error');
  }
}
