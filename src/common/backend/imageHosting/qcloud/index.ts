import localeService from '@/common/locales';
import { ImageHostingServiceMeta } from '../interface';
import Service from './service';
import form from './form';

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.qcloud.name',
    }),
    icon: 'qcloud',
    type: 'qcloud',
    form,
    service: Service,
    permission: {
      origins: ['https://*.myqcloud.com/*'],
    },
  };
};
