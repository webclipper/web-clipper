import { ServiceMeta } from '../interface';
import Service from './service';
import Form from './form';

export default () => {
  return {
    name: 'Github Repository',
    icon: 'github_repository',
    type: 'github_repository',
    service: Service,
    form: Form,
    homePage: 'https://github.com/',
    permission: {
      origins: ['https://api.github.com/*'],
    },
  } as ServiceMeta;
};
