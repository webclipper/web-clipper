import localeService from '@/common/locales';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.imageHosting.leanote.name',
      defaultMessage: 'Leanote',
    }),
    icon: 'leanote',
    type: 'leanote',
    service: Service,
    builtIn: true,
    builtInRemark: localeService.format({
      id: 'backend.imageHosting.leanote.builtInRemark',
      defaultMessage: 'Leanote built in image hosting service.',
    }),
  };
};
