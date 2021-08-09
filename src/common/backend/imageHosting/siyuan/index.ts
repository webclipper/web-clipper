import localeService from '@/common/locales';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.imageHosting.siyuan.name',
    }),
    icon: 'siyuan',
    type: 'siyuan',
    service: Service,
    builtIn: true,
    builtInRemark: localeService.format({
      id: 'backend.imageHosting.siyuan.builtInRemark',
      defaultMessage: 'Siyuan Note built in image hosting service.',
    }),
  };
};
