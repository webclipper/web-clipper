import { IChannel, IServerChannel } from '@/service/common/ipc';
import { IWorkerService } from '.';

export class WorkerServiceChannel implements IServerChannel {
  constructor(private service: IWorkerService) {}

  callCommand = async (_ctx: any, command: string, arg: any): Promise<any> => {
    switch (command) {
      case 'changeIcon':
        return this.service.changeIcon(arg);
      case 'initContextMenu':
        return this.service.initContextMenu();
      default: {
        throw new Error(`Call not found: ${command}`);
      }
    }
  };
}

export class WorkerServiceChannelClient implements IWorkerService {
  constructor(private channel: IChannel) {}

  changeIcon = async (icon: string) => {
    return this.channel.call<void>('changeIcon', icon);
  };

  initContextMenu = async () => {
    return this.channel.call<void>('initContextMenu');
  };
}
