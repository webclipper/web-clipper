import localeService from '@/common/locales';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.imageHosting.joplin.name',
    }),
    icon: 'joplin',
    type: 'joplin',
    service: Service,
    builtIn: true,
    builtInRemark: localeService.format({
      id: 'backend.imageHosting.joplin.builtInRemark',
      defaultMessage: 'Joplin built in image hosting service.',
    }),
  };
};
