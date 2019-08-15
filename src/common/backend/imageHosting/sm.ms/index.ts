import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: 'sm.ms',
    icon: 'https://sm.ms/favicon.ico',
    type: 'sm.ms',
    service: Service,
  };
};
