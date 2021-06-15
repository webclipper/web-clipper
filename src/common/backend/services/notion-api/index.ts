import { ServiceMeta } from './../interface';

import localeService from '@/common/locales';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.notion-official-api.name',
    }),
    icon: 'baklib',
    type: 'notion-official-api',
    service: {} as any,
    homePage: 'https://www.notion.so/',
  };
};
