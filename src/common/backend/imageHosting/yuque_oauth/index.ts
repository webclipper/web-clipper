import localeService from '@/common/locales';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.imageHosting.yuque_oauth.name',
    }),
    icon: 'yuque',
    type: 'yuque_oauth',
    service: Service,
    builtIn: true,
    builtInRemark: localeService.format({
      id: 'backend.imageHosting.yuque_oauth.builtInRemark',
      defaultMessage: 'Yuque built in image hosting service.',
    }),
  };
};
