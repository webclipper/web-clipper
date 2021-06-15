import { ServiceMeta } from './../interface';

import localeService from '@/common/locales';

/**
 * https://developers.notion.com/
 */
export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.notion-official-api.name',
    }),
    icon: 'notion',
    type: 'notion-official-api',
    service: {} as any,
    homePage: 'https://www.notion.so/',
  };
};
