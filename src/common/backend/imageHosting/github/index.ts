import localeService from '@/common/locales';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';
import Form from './form';

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.imageHosting.github.name',
      defaultMessage: 'Github',
    }),
    icon: 'github',
    type: 'github',
    form: Form,
    service: Service,
    permission: {
      origins: ['https://api.github.com/*'],
    },
  };
};
