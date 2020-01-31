import localeService from '@/common/locales';
import { ServiceMeta } from '@/common/backend';
import Service from './service';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.dida365.name',
      defaultMessage: 'Dida365',
    }),
    icon: 'dida365',
    type: 'dida365',
    service: Service,
    permission: {
      origins: ['https://api.dida365.com/*'],
      permissions: ['webRequest', 'webRequestBlocking'],
    },
  };
};
