import { Container } from 'typedi';
import { IPowerpackService } from '@/service/common/powerpack';
import { getLanguage } from './locales/index';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/modelTypes/userPreference';
import { extend } from 'umi-request';
import config from '@/config';
import { localStorageService } from './chrome/storage';
import { LOCAL_ACCESS_TOKEN_LOCALE_KEY } from './modelTypes/userPreference';
import { IResponse } from './types';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import { generateUuid } from '@web-clipper/shared/lib/uuid';

dayjs.extend(timezone);

const request = extend({
  prefix: `${config.serverHost}/api/`,
  timeout: 10000,
  headers: {},
});

request.interceptors.request.use(
  (url, options) => {
    const powerpackService = Container.get(IPowerpackService);
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
          locale: localStorageService.get(LOCAL_USER_PREFERENCE_LOCALE_KEY, getLanguage()),
        },
      },
    };
  },
  { global: false }
);

request.interceptors.response.use(
  response => {
    if (response.clone().status === 401) {
      localStorageService.delete(LOCAL_ACCESS_TOKEN_LOCALE_KEY);
    }
    return response;
  },
  { global: false }
);

request.interceptors.response.use(
  async response => {
    if (response.clone().status !== 200) {
      const data: IResponse<unknown> = await response.clone().json();
      if (data.message) {
        throw new Error(data.message);
      }
    }
    return response;
  },
  { global: false }
);

export interface SendToKindleRequestBody {
  to: string;
  title: string;
  content: string;
}

export const sentToKindle = (data: SendToKindleRequestBody) => {
  return request.post('service/sendToKindle', { data });
};

export interface OCRRequestBody {
  image: string;
  language_type: 'CHN_ENG' | 'ENG' | 'JAP' | 'GER';
}

export const ocr = (data: OCRRequestBody) => {
  return request.post<IResponse<string>>('service/ocr', { data });
};
