import localeService from '@/common/locales';
import { ServiceMeta } from '@/common/backend';
import Service from './service';
import headerForm from './headerForm';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.dida365.name',
    }),
    icon: 'dida365',
    type: 'dida365',
    headerForm,
    service: Service,
    permission: {
      origins: ['https://api.dida365.com/*'],
      permissions: ['webRequest', 'webRequestBlocking'],
    },
  };
};
