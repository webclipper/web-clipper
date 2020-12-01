import { CompleteStatus } from 'common/backend/interface';
import {
  GithubBackendServiceConfig,
  GithubUserInfoResponse,
  GithubRepositoryResponse,
  GithubRepository,
  GithubCreateDocumentRequest,
} from './interface';
import { DocumentService } from '../../index';
import axios, { AxiosInstance } from 'axios';
import md5 from '@web-clipper/shared/lib/md5';
import { stringify } from 'qs';
import { isUndefined, toNumber } from 'lodash';
import fileNamify from 'filenamify';

const PAGE_LIMIT = 100;

export default class GithubRepositoryDocumentService implements DocumentService {
  private request: AxiosInstance;
  private repositories: GithubRepository[];
  private config: GithubBackendServiceConfig;

  constructor(config: GithubBackendServiceConfig) {
    const request = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${config.accessToken}`,
      },
      timeout: 10000,
      transformResponse: [
        (data): string => {
          return JSON.parse(data);
        },
      ],
      withCredentials: true,
    });
    this.request = request;
    this.repositories = [];
    this.config = config;
  }

  getId = () => {
    return md5(`${this.config.accessToken}_github_repository`);
  };

  getStorageLocation = () => {
    return this.config.storageLocation;
  };

  getUserInfo = async () => {
    const data = await this.request.get<GithubUserInfoResponse>('user');
    const { name, avatar_url: avatar, html_url: homePage, bio: description } = data.data;
    return {
      name,
      avatar,
      homePage,
      description,
    };
  };

  getRepositories = async (): Promise<GithubRepository[]> => {
    let page = 1;
    let foo = await this.getGithubRepositories({ page, visibility: this.config.visibility });
    let result: GithubRepository[] = [];
    result = result.concat(foo);
    while (foo.length === PAGE_LIMIT) {
      page++;
      foo = await this.getGithubRepositories({ page, visibility: this.config.visibility });
      result = result.concat(foo);
    }
    this.repositories = result;
    return result;
  };

  createDocument = async (info: GithubCreateDocumentRequest): Promise<CompleteStatus> => {
    if (!this.repositories) {
      this.getRepositories();
    }
    const { content: body, title, repositoryId } = info;
    const repository = this.repositories.find(o => o.id === repositoryId);
    if (!repository) {
      throw new Error('can not find repository');
    }

    if (isUndefined(this.config.savePath)) this.config.savePath = '';
    if (this.config.savePath.startsWith('/')) this.config.savePath.substr(1);
    if (!this.config.savePath.endsWith('/') && this.config.savePath.length > 0)
      this.config.savePath += '/';

    let b64EncodeUnicode = (str: string) => {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(_match, p1) {
          return String.fromCharCode(toNumber(`0x${p1}`));
        })
      );
    };
    let fileContent: string = b64EncodeUnicode(`# ${title}\n${body}`);

    let fileName: string = fileNamify(title, { replacement: ' ' });

    let requestPath: string = `/repos/${repository.namespace}/contents/${this.config.savePath}${fileName}.md`;

    const response = await this.request
      .put<{
        content: { html_url: string };
      }>(requestPath, {
        message: `Clip "${title}"`,
        content: fileContent,
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 422)
            throw new Error('Response Status: 422. The file may already exist.');
        } else if (error.request) {
          throw new Error(error.request);
        } else {
          throw new Error(error.message);
        }
      });

    return response ? { href: response.data.content.html_url } : {};
  };

  private getGithubRepositories = async ({
    page,
    visibility,
  }: {
    page: number;
    visibility: string;
  }) => {
    const response = await this.request.get<GithubRepositoryResponse[]>(
      `user/repos?${stringify({ page, per_page: PAGE_LIMIT, visibility })}`
    );
    const repositories = response.data;
    return repositories.map(
      (repository): GithubRepository => {
        const { id, name, full_name: namespace } = repository;
        return {
          id: id.toString(),
          name,
          namespace,
          groupId: namespace.split('/')[0],
          groupName: namespace.split('/')[0],
        };
      }
    );
  };
}
