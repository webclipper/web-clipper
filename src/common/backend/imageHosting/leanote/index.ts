import localeService from '@/common/locales';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.imageHosting.leanote.name',
    }),
    icon: 'leanote',
    type: 'leanote',
    service: Service,
    builtIn: true,
    builtInRemark: localeService.format({
      id: 'backend.imageHosting.leanote.builtInRemark',
    }),
  };
};
