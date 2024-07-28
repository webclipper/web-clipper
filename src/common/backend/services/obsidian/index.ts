import localeService from '@/common/locales';
import { ServiceMeta } from './../interface';
import Service from './service';
import From from './form';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.obsidian.name',
      defaultMessage: 'Obsidian',
    }),
    form: From,
    icon: 'obsidian',
    type: 'obsidian',
    service: Service,
  };
};
