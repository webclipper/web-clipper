import { IExtendRequestHelper, IRequestService } from '@/service/common/request';
import { CreateDocumentRequest } from '../../index';
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
 * Client for self hosted wallabag or wallabag.com
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
    let response = await this.request.get<WallabagUserInfoResponse>('user.json');
    if ((response as any).error && (response as any).error === 'invalid_grant') {
      await this.refreshToken();
      response = await this.request.get<WallabagUserInfoResponse>('user.json');
    }

    return response;
  };

  /**
   * @TODO: Support markdown
   *
   * Perform a POST with document request as formData to wallabag server to create a note
   *
   * @see documentation https://github.com/wallabag/wallabag/wiki/wallabag-api
   */
  createDocument = async (info: CreateDocumentRequest): Promise<WallabagCreateDocumentResponse> => {
    const formData = new FormData();
    const html = converter.makeHtml(`${info.content}`);
    formData.append('content', html);
    formData.append('title', info.title);
    if (info.url) {
      formData.append('url', info.url as string);
    }

    return this.request.postForm<WallabagCreateDocumentResponse>('entries.json', {
      data: formData,
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

    return response.access_token;
  };
}
