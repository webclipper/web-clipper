/**
 * @jest-environment jsdom
 */
import { IRequest, TRequestOption } from '@/service/common/request';
import { RequestHelper } from './reqeust';

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
      { method: 'get', headers: {} },
    ]);

    request.get('https://clipper.website');
    expect(mockRequest.mock.request.mock.calls[1]).toEqual([
      'https://clipper.website',
      { method: 'get', headers: {} },
    ]);

    request.get('http://clipper.website');
    expect(mockRequest.mock.request.mock.calls[2]).toEqual([
      'http://clipper.website',
      { method: 'get', headers: {} },
    ]);
  });

  it('test post', () => {
    const mockRequest = new MockRequest(() => {
      return '';
    });
    const request = new RequestHelper({
      baseURL: 'https://api.clipper.website/',
      request: mockRequest,
    });
    request.post('DiamondYuan', {
      data: { name: 'DiamondYuan' },
    });
    expect(mockRequest.mock.request.mock.calls[0]).toEqual([
      'https://api.clipper.website/DiamondYuan',
      { method: 'post', requestType: 'json', data: { name: 'DiamondYuan' }, headers: {} },
    ]);

    const formData = new FormData();
    formData.set('name', 'DiamondYuan');
    request.postForm('DiamondYuan', {
      data: formData,
    });
    expect(mockRequest.mock.request.mock.calls[1]).toEqual([
      'https://api.clipper.website/DiamondYuan',
      { method: 'post', requestType: 'form', data: formData, headers: {} },
    ]);
  });

  it('test header', () => {
    const mockRequest = new MockRequest(() => {
      return '';
    });
    const request = new RequestHelper({
      baseURL: 'https://api.clipper.website/',
      headers: {
        token: '12345',
      },
      request: mockRequest,
    });
    request.post('DiamondYuan', {
      data: { name: 'DiamondYuan' },
    });
    expect(mockRequest.mock.request.mock.calls[0]).toEqual([
      'https://api.clipper.website/DiamondYuan',
      {
        method: 'post',
        requestType: 'json',
        data: { name: 'DiamondYuan' },
        headers: { token: '12345' },
      },
    ]);

    request.post('DiamondYuan', {
      data: { name: 'DiamondYuan' },
      headers: { token: '123456' },
    });
    expect(mockRequest.mock.request.mock.calls[1]).toEqual([
      'https://api.clipper.website/DiamondYuan',
      {
        method: 'post',
        requestType: 'json',
        data: { name: 'DiamondYuan' },
        headers: { token: '123456' },
      },
    ]);
  });
});
