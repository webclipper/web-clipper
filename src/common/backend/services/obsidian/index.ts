import { ServiceMeta } from '@/common/backend';
import localeService from '@/common/locales';
import Service from './service';
import Form from './form';

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.obsidian.name',
      defaultMessage: 'Obsidian',
    }),
    icon: 'https://avatars.githubusercontent.com/u/65011256?s=200&v=4',
    type: 'obsidian',
    homePage: 'https://obsidian.md',
    service: Service,
    form: Form,
  };
};
