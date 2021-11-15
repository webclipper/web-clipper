import { DocumentService, CreateDocumentRequest } from './../../index';
import axios, { AxiosInstance } from 'axios';
import md5 from '@web-clipper/shared/lib/md5';
import {
  OneNoteNotebooksResponse,
  OneNoteUserInfoResponse,
  OneNoteCreateDocumentResponse,
  OneNoteBackendServiceConfig,
  OneNoteRefreshTokenResponse,
} from './interface';
import _ from 'lodash';
import { Repository, UserInfo, UnauthorizedError } from '../interface';
import showdown from 'showdown';
import config from '@/config';
import { stringify } from 'qs';

const converter = new showdown.Converter();

const BASE_URL = `https://graph.microsoft.com/`;

export default class YuqueDocumentService implements DocumentService<OneNoteBackendServiceConfig> {
  private request: AxiosInstance;
  private config: OneNoteBackendServiceConfig;
  private repositories: Repository[];

  constructor({ access_token, refresh_token }: OneNoteBackendServiceConfig) {
    this.config = { access_token, refresh_token };
    this.request = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `bearer ${access_token}` },
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
    this.repositories = [];
  }

  getId = () => md5(this.config.access_token);

  getUserInfo = async (): Promise<UserInfo> => {
    const response = await this.request.get<OneNoteUserInfoResponse>('v1.0/me');
    const { data } = response;
    return {
      name: data.displayName,
      description: data.userPrincipalName,
      avatar: '',
      homePage: 'https://www.onenote.com/notebooks',
    };
  };

  getRepositories = async (): Promise<Repository[]> => {
    const response = await this.request.get<OneNoteNotebooksResponse>(
      '/v1.0/me/onenote/notebooks??expand=sections,sectionGroups'
    );

    let promises = await response.data.value.map(({ id: groupId, displayName: groupName }) => {
      return this.getSections(true, groupId, '', groupId, groupName);
    });

    for (const p of promises) {
      this.repositories.push(..._.flatten(await p));
    }

    return this.repositories;
  };

  /**
   * Add sections recursively (even for those in Section Groups)
   *
   * @param {boolean} notebook In Microsoft API, the topmost level should be "notebooks",
   *                           then "sectionGroups" in later levels
   * @param {string} preId The id passing in.
   * @param {string} prefix to denote names of Section Groups.
   * @param {sring} groupId for notebook id.
   * @param {string} groupName for notebook name.
   */
  getSections = async (
    notebook: boolean,
    preId: string,
    prefix: string,
    groupId: string,
    groupName: string
  ): Promise<Repository[]> => {
    let repos = [];

    // Handle sections
    const sectionsRes = await this.request.get<OneNoteNotebooksResponse>(
      `/v1.0/users/me/onenote/${notebook ? 'notebooks/' : 'sectionGroups/'}${preId}/sections`
    );
    repos.push(
      ..._.flatten(
        sectionsRes.data.value.map(({ id, displayName: tempName }) => {
          let name = (prefix === '' ? '' : `${prefix}-`) + tempName;
          return {
            name,
            id,
            groupId,
            groupName,
          };
        })
      )
    );

    // Handle sectionGroups recursively
    const sectionGroupsRes = await this.request.get<OneNoteNotebooksResponse>(
      `/v1.0/users/me/onenote/${notebook ? 'notebooks/' : 'sectionGroups/'}${preId}/sectionGroups`
    );
    let promises = await sectionGroupsRes.data.value.map(({ id, displayName: subPrefix }) => {
      let newPrefix = (prefix === '' ? '' : `${prefix}-`) + subPrefix;
      return this.getSections(false, id, newPrefix, groupId, groupName);
    });

    for (const p of promises) {
      repos.push(..._.flatten(await p));
    }

    return repos;
  };

  createDocument = async (info: CreateDocumentRequest): Promise<any> => {
    const { repositoryId } = info;
    const repository = this.repositories.find(o => o.id === repositoryId);
    if (!repository) {
      throw new Error('Illegal repositoryId');
    }
    let formData = new FormData();
    const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>${info.title}</title>
      </head>
      <body>
       ${converter.makeHtml(`${info.content}`)}
      </body>
    </html>`;
    const blob = new Blob([html], {
      type: 'text/html',
    });
    formData.append('Presentation', blob);
    const result = await this.request.post<OneNoteCreateDocumentResponse>(
      `v1.0/me/onenote/sections/${encodeURI(repositoryId)}/pages`,
      formData
    );
    return {
      href: result.data.links.oneNoteWebUrl.href,
    };
  };

  refreshToken = async ({ access_token, refresh_token, ...rest }: OneNoteBackendServiceConfig) => {
    const response = await this.request.post<OneNoteRefreshTokenResponse>(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      stringify({
        scope: 'Notes.Create User.Read offline_access',
        redirect_uri: config.oneNoteCallBack,
        grant_type: 'refresh_token',
        client_id: config.oneNoteClientId,
        refresh_token,
      })
    );
    return {
      ...rest,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };
  };
}
