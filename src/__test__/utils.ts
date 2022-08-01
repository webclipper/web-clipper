import { IRequestService, TRequestOption } from '@/service/common/request';
import { vi, Mock } from 'vitest';

type TMockRequestServiceHandler = (url: string, options?: TRequestOption) => any;

export class MockRequestService implements IRequestService {
  public mock: {
    request: Mock;
  };
  private handler: TMockRequestServiceHandler;
  constructor(handler: TMockRequestServiceHandler) {
    this.mock = {
      request: vi.fn(),
    };
    this.handler = handler;
  }

  request(url: string, options: TRequestOption) {
    this.mock.request(url, options);
    return this.handler(url, options);
  }

  download(url: string): Promise<Blob> {
    return Promise.resolve(new Blob([url]));
  }
}
