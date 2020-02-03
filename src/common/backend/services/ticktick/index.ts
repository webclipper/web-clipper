import localeService from '@/common/locales';
import { ServiceMeta } from '@/common/backend';
import Service from './service';
import headerForm from './headerForm';
import form from './form';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.ticktick.name',
      defaultMessage: 'TickTick',
    }),
    icon: 'dida365',
    type: 'ticktick',
    headerForm,
    form: form,
    service: Service,
    permission: {
      origins: ['https://api.ticktick.com/*'],
      permissions: ['webRequest', 'webRequestBlocking'],
    },
  };
};
