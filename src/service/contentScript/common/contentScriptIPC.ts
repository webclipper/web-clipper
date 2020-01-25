import { IContentScriptService } from '@/service/common/contentScript';
import { IServerChannel, IChannel } from '@/service/common/ipc';

export class ContentScriptChannel implements IServerChannel {
  constructor(private service: IContentScriptService) {}

  call = async (_context: chrome.runtime.Port['sender'], command: string): Promise<any> => {
    switch (command) {
      case 'remove':
        return this.service.remove();
      case 'hide':
        return this.service.hide();
      default: {
        throw new Error(`Call not found: ${command}`);
      }
    }
  };
}

export class ContentScriptChannelClient implements IContentScriptService {
  constructor(private channel: IChannel) {}

  remove = async (): Promise<void> => {
    return this.channel.call('remove');
  };

  hide = async (): Promise<void> => {
    return this.channel.call('hide');
  };
}
