import { IPermissionsService, Permissions } from '@/service/common/permissions';
import { IServerChannel, IChannel } from '@/service/common/ipc';

export class PermissionsChannel implements IServerChannel {
  constructor(private service: IPermissionsService) {}

  call = async (
    _context: chrome.runtime.Port['sender'],
    command: string,
    arg: any
  ): Promise<any> => {
    switch (command) {
      case 'contains':
        return this.service.contains(arg);
      case 'remove':
        return this.service.remove(arg);
      case 'request':
        return this.service.request(arg);
      default: {
        throw new Error(`Call not found: ${command}`);
      }
    }
  };
}

export class PermissionsChannelClient implements IPermissionsService {
  constructor(private channel: IChannel) {}

  remove = async (permissions: Permissions): Promise<boolean> => {
    return this.channel.call('remove', permissions);
  };

  contains = async (permissions: Permissions): Promise<boolean> => {
    return this.channel.call('contains', permissions);
  };
  request = async (permissions: Permissions): Promise<boolean> => {
    return this.channel.call('request', permissions);
  };
}
