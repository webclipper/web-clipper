import { extend } from 'umi-request';
import config from '@/config';
import { localStorageService } from './chrome/storage';
import { LOCAL_ACCESS_TOKEN_LOCALE_KEY } from './modelTypes/userPreference';
import { IResponse, IUserInfo } from './types';

const request = extend({
  prefix: `${config.serverHost}/api/`,
  timeout: 1000,
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

export const getUserInfo = () => {
  return request.get<IResponse<IUserInfo>>('/user');
};
