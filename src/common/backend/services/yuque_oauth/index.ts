import config from '@/config';
import { ServiceMeta } from './../interface';
import Service from './service';
import localeService from '@/common/locales';
import { stringify } from 'qs';
import form from './form';
import headerForm from './headerForm';
import { IConfigService } from '@/service/common/config';
import { Container } from 'typedi';

const oauthUrl = `https://www.yuque.com/oauth2/authorize?${stringify({
  client_id: config.yuqueClientId,
  scope: config.yuqueScope,
  redirect_uri: config.yuqueCallback,
  state: Container.get(IConfigService).id,
  response_type: 'code',
})}`;

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.yuque_oauth.name',
      defaultMessage: 'Yuque Oauth',
    }),
    icon: 'yuque',
    type: 'yuque_oauth',
    headerForm: headerForm,
    service: Service,
    oauthUrl,
    form: form,
    homePage: 'https://www.yuque.com',
    permission: {
      origins: ['https://www.yuque.com/*'],
    },
  };
};
