import {
  ITabService,
  Tab,
  CaptureVisibleTabOptions,
  AbstractTabService,
} from '@/service/common/tab';
import { IServerChannel, IChannel } from '@/service/common/ipc';

export class TabChannel implements IServerChannel {
  constructor(private service: ITabService) {}

  call = async (
    context: chrome.runtime.Port['sender'],
    command: string,
    arg: any
  ): Promise<any> => {
    switch (command) {
      case 'getCurrent':
        return context?.tab;
      case 'remove':
        return this.service.remove(arg);
      case 'captureVisibleTab':
        return this.service.captureVisibleTab(arg);
      case 'create':
        return this.service.create(arg);
      case 'sendMessage':
        return this.service.sendMessage(arg[0], arg[1]);
      default: {
        throw new Error(`Call not found: ${command}`);
      }
    }
  };
}

export class TabChannelClient extends AbstractTabService {
  constructor(private channel: IChannel) {
    super();
  }

  getCurrent = async (): Promise<Tab> => {
    return this.channel.call('getCurrent');
  };

  remove = async (tabId: number): Promise<void> => {
    return this.channel.call('remove', tabId);
  };

  captureVisibleTab = async (option: CaptureVisibleTabOptions | number) => {
    return this.channel.call<string>('captureVisibleTab', option);
  };

  sendMessage = async <T>(tabId: number, message: any) => {
    return this.channel.call<T>('sendMessage', [tabId, message]);
  };

  create = async (createProperties: chrome.tabs.CreateProperties) => {
    return this.channel.call<chrome.tabs.Tab>('create', createProperties);
  };
}
