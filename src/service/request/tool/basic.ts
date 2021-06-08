import { IPermissionsService } from './../../common/permissions';
import { extend, RequestMethod } from 'umi-request';
import { IRequestService, IBasicRequestService, TRequestOption } from '@/service/common/request';
import Container, { Service } from 'typedi';
import axios from 'axios';
class BasicRequestService implements IRequestService {
  private requestMethod: RequestMethod;
  constructor() {
    this.requestMethod = extend({});
  }

  async download(url: string) {
    const permissionsService = Container.get(IPermissionsService);
    await permissionsService.request({ origins: [`${new URL(url).origin}/*`] });
    const res = await axios.get(url, { responseType: 'blob' });
    return res.data;
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
