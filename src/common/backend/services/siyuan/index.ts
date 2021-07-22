import { ServiceMeta } from './../interface';
import Service from './service';

export default () => {
  return {
    name: 'Siyuan',
    icon: 'github',
    type: 'siyuan',
    service: Service,
    homePage: 'https://github.com/',
    permission: {
      origins: ['http://localhost:41184/*'],
    },
  } as ServiceMeta;
};
