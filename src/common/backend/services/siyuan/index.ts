import localeService from '@/common/locales';
import { ServiceMeta } from './../interface';
import Service from './service';

/**
 * @see https://github.com/siyuan-note/siyuan/issues/1266
 */
export default () => {
  return {
    name: localeService.format({
      id: 'backend.services.siyuan.name',
    }),
    icon: 'siyuan',
    type: 'siyuan',
    service: Service,
    homePage: 'https://b3log.org/siyuan/',
    permission: {
      origins: ['http://localhost:6806/*'],
    },
  } as ServiceMeta;
};
