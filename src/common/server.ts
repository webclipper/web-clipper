import { getLanguage } from './locales/index';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/modelTypes/userPreference';
import { extend } from 'umi-request';
import config from '@/config';
import { localStorageService } from './chrome/storage';
import { LOCAL_ACCESS_TOKEN_LOCALE_KEY } from './modelTypes/userPreference';
import { IResponse, IUserInfo } from './types';

const request = extend({
  prefix: `${config.serverHost}/api/`,
  timeout: 10000,
  headers: {},
});

request.interceptors.request.use(
  (url, options) => {
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          token: localStorageService.get(LOCAL_ACCESS_TOKEN_LOCALE_KEY, ''),
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

export const getUserInfo = () => {
  return request.get<IResponse<IUserInfo>>('user');
};

export interface PostMailRequestBody {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export const postMail = (data: PostMailRequestBody) => {
  return request.post('service/email', { data });
};

export interface SendToKindleRequestBody {
  to: string;
  title: string;
  content: string;
}

export const sentToKindle = (data: SendToKindleRequestBody) => {
  return request.post('service/sendToKindle', { data });
};

export const refresh = () => {
  return request.get<IResponse<string>>('refresh');
};

export interface OCRRequestBody {
  image: string;
  language_type: 'CHN_ENG' | 'ENG' | 'JAP' | 'GER';
}

export const ocr = (data: OCRRequestBody) => {
  return request.post<IResponse<string>>('service/ocr', { data });
};
