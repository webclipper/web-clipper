import { extend, RequestMethod } from 'umi-request';
import { IRequestService, IBasicRequestService, TRequestOption } from '@/service/common/request';
import { Service } from 'typedi';

class BasicRequestService implements IRequestService {
  private requestMethod: RequestMethod;
  constructor() {
    this.requestMethod = extend({});
  }

  request(url: string, options: TRequestOption) {
    switch (options.method) {
      case 'get': {
        return this.requestMethod.get(url, {
          headers: options.headers,
        });
      }
      case 'put': {
        return this.requestMethod.put(url, {
          headers: options.headers,
          data: options.data,
        });
      }
      case 'post': {
        return this.requestMethod.post(url, {
          headers: options.headers,
          data: options.data,
          requestType: options.requestType,
        });
      }
      default: {
        throw new Error('Unsupported request method');
      }
    }
  }
}

Service(IBasicRequestService)(BasicRequestService);
