import { ServiceMeta } from './../interface';
import Service from './service';
import Form from './form';
import localeService from '@/common/locales';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.yuque.name',
      defaultMessage: 'Yuque',
    }),
    icon: 'yuque',
    type: 'yuque',
    service: Service,
    form: Form,
    homePage: 'https://www.yuque.com',
  };
};
