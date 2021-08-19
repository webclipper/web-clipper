import { IResponse } from '@/common/types';
import { ILocalStorageService } from '@/service/common/storage';
import { IPowerpackService } from '@/service/common/powerpack';
import { RequestHelper } from '@/service/request/common/request';
import {
  IBasicRequestService,
  IRequestService,
  IExtendRequestHelper,
} from '@/service/common/request';
import { ILocaleService } from '@/service/common/locale';
import { Inject, Container } from 'typedi';
import { IBackendService, PostMailRequestBody, WebClipperRemoteConfig } from './backend';
import config from '@/config';
import { generateUuid } from '@web-clipper/shared/lib/uuid';

export class BackendService implements IBackendService {
  private request: IExtendRequestHelper;
  constructor(
    @Inject(ILocaleService) localeService: ILocaleService,
    @Inject(IBasicRequestService) private basicRequestService: IRequestService
  ) {
    this.request = new RequestHelper({
      baseURL: `${config.serverHost}/api/`,
      request: this.basicRequestService,
      interceptors: {
        request: [
          (url, options) => {
            const powerpackService = Container.get(IPowerpackService);
            const localStorageService = Container.get(ILocalStorageService);
            let requestId = generateUuid();
            if (!localStorageService.get('d-request-id')) {
              localStorageService.set('d-request-id', requestId);
            }
            return {
              url,
              options: {
                ...options,
                headers: {
                  ...options.headers,
                  token: powerpackService.accessToken || '',
                  'd-request-id': localStorageService.get('d-request-id', requestId),
                  'web-clipper-version': `${WEB_CLIPPER_VERSION}`,
                  locale: localeService.locale,
                },
              },
            };
          },
        ],
      },
    });
  }

  async refreshToken(): Promise<string> {
    const token = await this.request.get<{ result: string }>('refresh');
    return token.result;
  }

  async sendEmail(data: PostMailRequestBody): Promise<void> {
    await this.request.post('service/email', { data });
    return;
  }

  async fetchRemoteConfig(): Promise<WebClipperRemoteConfig> {
    const response = await this.request.get<IResponse<WebClipperRemoteConfig>>('v1/config');
    return response.result;
  }
}
