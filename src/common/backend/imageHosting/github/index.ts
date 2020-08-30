import { ImageHostingServiceMeta } from '../interface';
import Service from './service';
import Form from './form';

export default (): ImageHostingServiceMeta => {
  return {
    name: 'Github',
    icon: 'github',
    type: 'github',
    form: Form,
    service: Service,
    permission: {
      origins: ['https://api.github.com/*'],
    },
  };
};
