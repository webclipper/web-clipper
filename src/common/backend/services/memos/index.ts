import { ServiceMeta } from '../interface';
import Service from './service';
import Form from './form';
import localeService from '@/common/locales';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.memos.name',
    }),
    icon: 'memos',
    type: 'memos',
    service: Service,
    form: Form,
    homePage: 'https://www.usememos.com/',
  };
};
