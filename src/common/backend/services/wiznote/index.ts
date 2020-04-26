import localeService from '@/common/locales';
import Service from './service';
import Form from './form';
import headerForm from './headerForm';

export default () => {
  return {
    name: localeService.format({
      id: 'backend.services.wiznote.name',
      defaultMessage: 'WizNote',
    }),
    icon: 'wiznote',
    type: 'WizNote',
    headerForm,
    service: Service,
    form: Form,
    permission: {
      permissions: ['cookies', 'webRequest', 'webRequestBlocking'],
    },
  };
};
