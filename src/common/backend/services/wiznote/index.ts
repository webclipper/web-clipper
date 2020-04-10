import localeService from '@/common/locales';
import Service from './service';
import Form from './form';

export default () => {
  return {
    name: localeService.format({
      id: 'backend.services.wiznote.name',
      defaultMessage: 'WizNote',
    }),
    icon: 'wiznote',
    type: 'WizNote',
    service: Service,
    form: Form,
  };
};
