import { RequestHelper, IPostRequestOptions, IPostFormRequestOptions, IRequest } from './reqeust';

type handler = (method: string, url: string, options?: any) => any;

class MockRequest implements IRequest {
  public mock: {
    get: jest.Mock;
    post: jest.Mock;
    postForm: jest.Mock;
  };
  private handler: handler;
  constructor(handler: handler) {
    this.mock = {
      get: jest.fn(),
      post: jest.fn(),
      postForm: jest.fn(),
    };
    this.handler = handler;
  }

  get(url: string) {
    this.mock.get(url);
    return this.handler('get', url);
  }

  post(url: string, options: IPostRequestOptions) {
    this.mock.get(url);
    return this.handler('post', url, options);
  }

  postForm(url: string, options: IPostFormRequestOptions) {
    this.mock.get(url);
    return this.handler('postForm', url, options);
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
    expect(mockRequest.mock.get.mock.calls[0]).toEqual(['https://api.clipper.website/diamondyuan']);

    request.get('https://clipper.website');
    expect(mockRequest.mock.get.mock.calls[1]).toEqual(['https://clipper.website']);

    request.get('http://clipper.website');
    expect(mockRequest.mock.get.mock.calls[2]).toEqual(['http://clipper.website']);
  });
});
