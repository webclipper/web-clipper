import { ITabService, Tab, CaptureVisibleTabOptions } from '@/service/common/tab';
import { IServerChannel, IChannel } from '@/service/common/rpc';

export class TabChannel implements IServerChannel {
  constructor(private service: ITabService) {}

  call = async (command: string, arg: any): Promise<any> => {
    switch (command) {
      case 'getCurrent':
        return this.service.getCurrent();
      case 'remove':
        return this.service.remove(arg);
      case 'captureVisibleTab':
        return this.service.captureVisibleTab(arg);
      case 'closeCurrent':
        return this.service.closeCurrent();
      case 'sendMessage':
        return this.service.sendMessage(arg[0], arg[1]);
      case 'sendActionToCurrentTab':
        return this.service.sendActionToCurrentTab(arg);
      default: {
        throw new Error(`Call not found: ${command}`);
      }
    }
  };
}

export class TabChannelClient implements ITabService {
  constructor(private channel: IChannel) {}

  getCurrent = async (): Promise<Tab> => {
    return this.channel.call('getCurrent');
  };

  remove = async (tabId: number): Promise<void> => {
    return this.channel.call('remove', tabId);
  };

  closeCurrent = async () => {
    return this.channel.call<void>('closeCurrent');
  };

  captureVisibleTab = async (option: CaptureVisibleTabOptions | number) => {
    return this.channel.call<string>('captureVisibleTab', option);
  };

  sendMessage = async <T>(tabId: number, message: any) => {
    return this.channel.call<T>('sendMessage', [tabId, message]);
  };

  sendActionToCurrentTab = async <T>(action: any): Promise<T> => {
    return this.channel.call('sendActionToCurrentTab', action);
  };
}
