import { ImageHostingServiceMeta } from '../interface';
import Service from './service';
import Form from './form';
import localeService from '@/common/locales';

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.imageHosting.yuque.name',
      defaultMessage: 'Yuque',
    }),
    icon: 'yuque',
    type: 'yuque',
    service: Service,
    form: Form,
    support: (type: string) => {
      return type === 'yuque';
    },
  };
};
