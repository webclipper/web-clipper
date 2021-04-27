import { IExtendRequestHelper, IRequestService } from '@/service/common/request';
import { CreateDocumentRequest, UnauthorizedError } from 'common/backend/services/interface';
import { RequestHelper } from '@/service/request/common/request';
import showdown from 'showdown';
import {
  WallabagBackendServiceConfig,
  WallabagCreateDocumentResponse,
  WallabagRefreshTokenResponse,
  WallabagUserInfoResponse,
} from './interface';
import { stringify } from 'qs';

const FormData = require('form-data');

const converter = new showdown.Converter();
/**
 * Client for self hosted wallabag or wallabag.it
 */
export default class WallabagClient {
  private config: WallabagBackendServiceConfig;
  private request: IExtendRequestHelper;
  private readonly requestService: IRequestService;

  /**
   * This class wrap a IExtendRequestHelper to perform HTTP request
   */
  constructor(
    {
      access_token,
      refresh_token,
      client_id,
      client_secret,
      wallabag_host,
    }: WallabagBackendServiceConfig,
    request: IRequestService
  ) {
    this.config = { access_token, refresh_token, client_id, client_secret, wallabag_host };
    this.requestService = request;
    this.request = new RequestHelper({
      baseURL: `${this.config.wallabag_host}/api/`,
      request: this.requestService,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  }

  /**
   * Perform a GET in user api to get current user information
   *
   * @see documentation https://app.wallabag.it/api/doc#get--api-user.{_format}
   */
  getUserInfo = async () => {
    return this.refreshTokenOnError(async () => {
      return this.request.get<WallabagUserInfoResponse>('user.json');
    });
  };

  /**
   * Wrap a function that performs a network request to refresh the token
   * and repeat the request when necessary.
   * @param fn function to (re-)execute
   */
  async refreshTokenOnError<T>(fn: () => T) {
    try {
      return await fn();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        throw new UnauthorizedError('Unauthorized! Please login to wallabag');
      }
      throw err;
    }
  }

  /**
   * Perform a POST with document request as formData to wallabag server to create an entry.
   *
   * @see documentation https://app.wallabag.it/api/doc#post--api-entries.{_format}
   */
  createDocument = async (info: CreateDocumentRequest): Promise<WallabagCreateDocumentResponse> => {
    const formData = new FormData();
    const html = converter.makeHtml(`${info.content}`);
    formData.append('content', html);
    formData.append('title', info.title);
    if (info.url) {
      formData.append('url', info.url as string);
    }

    return this.refreshTokenOnError(async () => {
      return this.request.postForm<WallabagCreateDocumentResponse>('entries.json', {
        data: formData,
      });
    });
  };

  /**
   * Perform a GET in token api
   *
   * @see documentation https://doc.wallabag.org/en/developer/api/oauth.html
   */
  refreshToken = async () => {
    if (
      this.config.client_secret === '' ||
      this.config.client_id === '' ||
      this.config.access_token === '' ||
      this.config.refresh_token === ''
    ) {
      throw new Error('Cannot login');
    }
    const response = await this.request.get<WallabagRefreshTokenResponse>(
      `${this.config.wallabag_host}/oauth/v2/token?${stringify({
        grant_type: 'refresh_token',
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
        refresh_token: this.config.refresh_token,
      })}`
    );
    this.config.access_token = response.access_token;
    this.config.refresh_token = response.refresh_token;

    this.request = new RequestHelper({
      baseURL: `${this.config.wallabag_host}/api/`,
      request: this.requestService,
      headers: {
        Authorization: `Bearer ${response.access_token}`,
      },
    });

    return { access_token: response.access_token, refresh_token: response.refresh_token };
  };
}
