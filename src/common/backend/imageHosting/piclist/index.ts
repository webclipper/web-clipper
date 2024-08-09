import Form from './form';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: 'piclist',
    icon: 'piclist',
    type: 'piclist',
    service: Service,
    form: Form,
    permission: {
      origins: ['<all_urls>'],    // often to be self-hosted
    },
  };
};
