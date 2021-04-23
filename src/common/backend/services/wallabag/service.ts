import { DocumentService, CreateDocumentRequest, UserInfo, UnauthorizedError } from './../../index';
import md5 from '@web-clipper/shared/lib/md5';
import {
  WallabagBackendServiceConfig,
  WallabagCreateDocumentResponse,
  WallabagTokenResponse,
  WallabagUserInfoResponse,
} from './interface';
import { CompleteStatus } from '../interface';
import showdown from 'showdown';
import axios, { AxiosInstance } from 'axios';
import { stringify } from 'qs';

const converter = new showdown.Converter();

export default class WallabagDocumentService implements DocumentService {
  private request: AxiosInstance;
  private access_token: string;
  private readonly origin: string;

  constructor({ origin, access_token }: WallabagBackendServiceConfig) {
    const realHost = origin || 'https://app.wallabag.it';
    this.request = axios.create({
      baseURL: `${realHost}/api/`,
      headers: { Authorization: `Bearer ${access_token}` },
      timeout: 100000,
      transformResponse: [data => JSON.parse(data)],
      withCredentials: true,
    });

    this.request.interceptors.response.use(
      r => r,
      error => {
        if (error.response && error.response.status === 401) {
          const ere = new UnauthorizedError();
          return Promise.reject(ere);
        }
        return Promise.reject(error);
      }
    );
    this.access_token = access_token;
    this.origin = origin;
  }

  getId = () => md5(this.access_token);

  getUserInfo = async (): Promise<UserInfo> => {
    const response = await this.request.get<WallabagUserInfoResponse>('user.json');
    return {
      name: response.data.username,
      avatar: '',
    };
  };

  getRepositories = async () => {
    let userInfo = await this.getUserInfo();
    return [
      {
        id: 'wallabag',
        name: `Wallabag for ${userInfo.name}`,
        groupId: 'wallabag',
        groupName: 'Wallabag',
      },
    ];
  };

  createDocument = async (
    info: CreateDocumentRequest & {
      channel: string;
      status: number;
    }
  ): Promise<CompleteStatus> => {
    let formData = new FormData();
    const html = converter.makeHtml(`${info.content}`);
    formData.append('content', html);
    formData.append('title', info.title);
    if (info.url) {
      formData.append('url', info.url as string);
    }

    const response = await this.request.post<WallabagCreateDocumentResponse>(
      'entries.json',
      formData
    );
    return {
      href: `${this.origin}/view/${encodeURIComponent(response.data.id)}`,
    };
  };

  refreshToken = async ({
    access_token,
    refresh_token,
    client_id,
    client_secret,
    ...rest
  }: WallabagBackendServiceConfig) => {
    const response = await this.request.get<WallabagTokenResponse>(
      `${this.origin}/oauth/v2/token?${stringify({
        grant_type: 'refresh_token',
        client_id,
        client_secret,
        refresh_token,
      })}`
    );
    this.access_token = response.data.access_token;
    return {
      ...rest,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      client_id,
      client_secret,
    };
  };
}
