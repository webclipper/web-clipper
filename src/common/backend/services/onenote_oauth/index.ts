import { IConfigService } from '@/service/common/config';
import { Container } from 'typedi';
import config from '@/config';
import { ServiceMeta } from './../interface';
import Service from './service';
import localeService from '@/common/locales';
import { stringify } from 'qs';
import form from './form';

const oauthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${stringify({
  scope: 'Notes.Create User.Read offline_access',
  client_id: config.oneNoteClientId,
  state: Container.get(IConfigService).id,
  response_type: 'code',
  response_mode: 'query',
  redirect_uri: config.oneNoteCallBack,
})}`;

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.onenote_oauth.name',
      defaultMessage: 'OneNote',
    }),
    icon: 'OneNote',
    type: 'onenote_oauth',
    service: Service,
    oauthUrl,
    form: form,
    homePage: 'https://products.office.com/en-us/onenote/digital-note-taking-app',
    permission: {
      origins: ['https://graph.microsoft.com/*', 'https://login.microsoftonline.com/*'],
    },
  };
};
