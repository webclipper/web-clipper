import { ServiceMeta } from './../interface';
import Service from './service';
import Form from './form';
import localeService from '@/common/locales';
import headerForm from './headerForm';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.joplin.name',
    }),
    icon: 'joplin',
    type: 'joplin',
    service: Service,
    headerForm,
    form: Form,
    homePage: 'https://joplinapp.org/',
    permission: {
      origins: ['http://localhost:41184/*'],
    },
  };
};
