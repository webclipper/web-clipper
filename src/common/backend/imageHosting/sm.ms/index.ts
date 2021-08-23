import { ImageHostingServiceMeta } from '../interface';
import Service from './service';
import form from './form';

export default (): ImageHostingServiceMeta => {
  return {
    name: 'sm.ms',
    icon: 'smms',
    type: 'sm.ms',
    form,
    service: Service,
    permission: {
      origins: ['https://sm.ms/*'],
    },
  };
};
