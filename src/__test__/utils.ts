import { IRequestService, TRequestOption } from '@/service/common/request';

type TMockRequestServiceHandler = (url: string, options?: TRequestOption) => any;

export class MockRequestService implements IRequestService {
  public mock: {
    request: jest.Mock;
  };
  private handler: TMockRequestServiceHandler;
  constructor(handler: TMockRequestServiceHandler) {
    this.mock = {
      request: jest.fn(),
    };
    this.handler = handler;
  }

  request(url: string, options: TRequestOption) {
    this.mock.request(url, options);
    return this.handler(url, options);
  }
}
