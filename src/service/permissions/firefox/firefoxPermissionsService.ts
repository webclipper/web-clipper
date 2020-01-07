import { IPermissionsService } from '@/service/common/permissions';
import { Service } from 'typedi';

class PermissionsService implements IPermissionsService {
  contains() {
    return Promise.resolve(true);
  }

  remove() {
    return Promise.resolve(true);
  }

  request() {
    return Promise.resolve(true);
  }
}

Service(IPermissionsService)(PermissionsService);
