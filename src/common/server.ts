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

request.interceptors.request.use((url, options) => {
  return {
    url,
    options: {
      ...options,
      headers: {
        ...options.headers,
        token: localStorageService.get(LOCAL_ACCESS_TOKEN_LOCALE_KEY, ''),
      },
    },
  };
});

request.interceptors.response.use(response => {
  if (response.clone().status === 401) {
    localStorageService.delete(LOCAL_ACCESS_TOKEN_LOCALE_KEY);
  }
  return response;
});

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

export const refresh = () => {
  return request.get<IResponse<string>>('refresh');
};
