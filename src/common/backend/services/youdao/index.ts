import { ServiceMeta } from '@/common/backend';
import localeService from '@/common/locales';
import Service from './service';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.youdao.name',
      defaultMessage: 'Youdao',
    }),
    icon: 'https://note.youdao.com/web/favicon.ico',
    type: 'youdao',
    homePage: 'https://note.youdao.com/web/',
    service: Service,
    permission: {
      origins: ['https://note.youdao.com/*'],
      permissions: ['cookies'],
    },
  };
};
