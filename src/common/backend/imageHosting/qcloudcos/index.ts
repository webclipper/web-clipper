import Form from './form';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: 'QcloudCos',
    icon: 'qcloudcos',
    type: 'qcloudcos',
    service: Service,
    form: Form,
    permission: {
      origins: ['https://*.myqcloud.com/*'],
    },
  };
};
