import { IPermissionsService, Permissions } from '@/service/common/permissions';
import { Service } from 'typedi';

class PermissionsService implements IPermissionsService {
  contains(p: Permissions) {
    return new Promise<boolean>((r) => {
      if (!chrome.permissions) {
        r(true);
        return;
      }
      chrome.permissions.contains(p, r);
    });
  }

  remove(p: Permissions) {
    return new Promise<boolean>((r) => {
      if (!chrome.permissions) {
        r(true);
        return;
      }
      chrome.permissions.remove(p, r);
    });
  }

  request(p: Permissions) {
    return new Promise<boolean>((r) => {
      if (!chrome.permissions) {
        r(true);
        return;
      }
      console.log('chrome.permissions.request ', chrome);
      chrome.permissions.request(p, r);
    });
  }
}

Service(IPermissionsService)(PermissionsService);
