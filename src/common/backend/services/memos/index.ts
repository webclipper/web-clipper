import { ServiceMeta } from '../interface';
import Service from './service';
import Form from './form';
import localeService from '@/common/locales';
import headerForm from './headerForm';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.memos.name',
    }),
    icon: '',
    type: 'memos',
    service: Service,
		headerForm: headerForm,
    form: Form,
    homePage: 'https://www.usememos.com/',
  };
};
