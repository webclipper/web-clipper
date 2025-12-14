import Service from './service';
import Form from './form';
import localeService from '@/common/locales';

export default () => {
  return {
    name: localeService.format({
      id: 'backend.services.feishu.name',
      defaultMessage: 'Feishu (OAuth)',
    }),
    icon: 'feishu',
    type: 'feishu',
    service: Service,
    form: Form,
    homePage: 'https://www.feishu.cn/drive/home/',
    permission: {
      origins: ['https://open.feishu.cn/*', 'https://*.workers.dev/*'],
    },
  };
};

