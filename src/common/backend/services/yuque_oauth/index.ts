import config from '@/config';
import { ServiceMeta } from './../interface';
import Service from './service';
import localeService from '@/common/locales';
import { stringify } from 'qs';
import form from './form';

const oauthUrl = `https://www.yuque.com/oauth2/authorize?${stringify({
  client_id: config.yuqueClientId,
  scope: config.yuequeScope,
  redirect_uri: config.yuqueCallback,
  state: chrome.runtime.id,
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
    service: Service,
    oauthUrl,
    form: form,
    homePage: 'https://www.yuque.com',
  };
};
