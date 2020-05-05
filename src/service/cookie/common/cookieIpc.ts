import { IServerChannel, IChannel } from '@/service/common/ipc';
import { ICookieService } from '@/service/common/cookie';

export class CookieChannel implements IServerChannel {
  constructor(private service: ICookieService) {}

  call = async (
    _context: chrome.runtime.Port['sender'],
    command: string,
    arg: any
  ): Promise<any> => {
    switch (command) {
      case 'get':
        return this.service.get(arg);
      case 'getAll':
        return this.service.getAll(arg);
      case 'getAllCookieStores':
        return this.service.getAllCookieStores();
      default: {
        throw new Error(`Call not found: ${command}`);
      }
    }
  };
}

export class CookieChannelClient implements ICookieService {
  constructor(private channel: IChannel) {}

  get = async (detail: chrome.cookies.Details): Promise<chrome.cookies.Cookie | null> => {
    return this.channel.call('get', detail);
  };

  getAll = async (detail: chrome.cookies.GetAllDetails): Promise<chrome.cookies.Cookie[]> => {
    return this.channel.call('getAll', detail);
  };

  getAllCookieStores = async (): Promise<chrome.cookies.CookieStore[]> => {
    return this.channel.call('getAllCookieStores');
  };
}
