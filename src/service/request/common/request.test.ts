import { RequestHelper, TRequestOption, IRequest } from './reqeust';

type handler = (url: string, options?: TRequestOption) => any;

class MockRequest implements IRequest {
  public mock: {
    request: jest.Mock;
  };
  private handler: handler;
  constructor(handler: handler) {
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

describe('test RequestHelper', () => {
  it('test baseURL', () => {
    const mockRequest = new MockRequest(() => {
      return '';
    });
    const request = new RequestHelper({
      baseURL: 'https://api.clipper.website/',
      request: mockRequest,
    });

    request.get('diamondyuan');
    expect(mockRequest.mock.request.mock.calls[0]).toEqual([
      'https://api.clipper.website/diamondyuan',
      { method: 'get' },
    ]);

    request.get('https://clipper.website');
    expect(mockRequest.mock.request.mock.calls[1]).toEqual([
      'https://clipper.website',
      { method: 'get' },
    ]);

    request.get('http://clipper.website');
    expect(mockRequest.mock.request.mock.calls[2]).toEqual([
      'http://clipper.website',
      { method: 'get' },
    ]);
  });
});
