import { ServiceMeta } from './../interface';
import Service from './service';
import Form from './form';
import localeService from '@/common/locales';
import headerForm from './headerForm';
import complete from './complete';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.baklib.name',
      defaultMessage: 'Baklib',
    }),
    complete,
    icon: 'baklib',
    type: 'baklib',
    service: Service,
    form: Form,
    headerForm,
    homePage: 'https://www.baklib.com/',
    permission: {
      origins: ['https://www.baklib.com/*'],
    },
  };
};
