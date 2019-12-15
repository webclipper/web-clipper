import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: 'sm.ms',
    icon: 'smms',
    type: 'sm.ms',
    service: Service,
    permission: {
      origins: ['https://sm.ms/*'],
    },
  };
};
