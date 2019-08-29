import { DocumentService, CreateDocumentRequest } from './../../index';
import axios, { AxiosInstance } from 'axios';
import md5 from '@web-clipper/shared/lib/md5';
import {
  OneNoteNotebooksResponse,
  OneNoteUserInfoResponse,
  OneNoteCreateDocumentResponse,
  OneNoteBackendServiceConfig,
} from './interface';
import _ from 'lodash';
import { Repository, UserInfo } from '../interface';
import showdown from 'showdown';

const converter = new showdown.Converter();

const BASE_URL = `https://graph.microsoft.com/`;

export default class YuqueDocumentService implements DocumentService {
  private request: AxiosInstance;
  private config: OneNoteBackendServiceConfig;
  private repositories: Repository[];

  constructor({ access_token, refresh_token }: OneNoteBackendServiceConfig) {
    this.config = { access_token, refresh_token };
    this.request = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `bearer ${access_token}` },
      timeout: 5000,
      transformResponse: [data => JSON.parse(data)],
      withCredentials: true,
    });
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
    this.repositories = _.flatten(
      response.data.value.map(({ id: groupId, displayName: groupName, sections }) => {
        return sections.map(({ id, displayName: name }) => ({
          name,
          id,
          groupId,
          groupName,
        }));
      })
    );
    return this.repositories;
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
      `v1.0/me/onenote/pages`,
      formData
    );
    return {
      href: result.data.links.oneNoteWebUrl.href,
    };
  };
}
