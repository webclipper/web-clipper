import Form from './form';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: 'PicGo',
    icon: 'icons/picgo.png',
    type: 'picgo',
    service: Service,
    form: Form,
    permission: {
      origins: ['<all_urls>'],
    },
  };
};
