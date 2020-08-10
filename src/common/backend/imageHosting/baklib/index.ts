import localeService from '@/common/locales';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.imageHosting.baklib.name',
      defaultMessage: 'Baklib',
    }),
    icon: 'baklib',
    type: 'baklib',
    service: Service,
    builtIn: true,
    builtInRemark: localeService.format({
      id: 'backend.imageHosting.baklib.builtInRemark',
      defaultMessage: 'Baklib built in image hosting service.',
    }),
  };
};
