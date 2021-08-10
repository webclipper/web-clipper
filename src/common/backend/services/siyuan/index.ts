import localeService from '@/common/locales';
import { ServiceMeta } from './../interface';
import Service from './service';
import form from './form';

/**
 * @see https://github.com/siyuan-note/siyuan/issues/1266
 */
export default () => {
  return {
    name: localeService.format({
      id: 'backend.services.siyuan.name',
    }),
    icon: 'siyuan',
    form,
    type: 'siyuan',
    service: Service,
    homePage: 'https://b3log.org/siyuan/',
    permission: {
      origins: ['http://localhost:6806/*', 'http://127.0.0.1:6806//*'],
    },
  } as ServiceMeta;
};
