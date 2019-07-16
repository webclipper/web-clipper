import { CompleteStatus } from 'common/backend/interface';
import {
  GithubBackendServiceConfig,
  GithubUserInfoResponse,
  GithubRepositoryResponse,
  GithubRepository,
} from './interface';
import { DocumentService, Repository, CreateDocumentRequest } from '../../index';
import axios, { AxiosInstance } from 'axios';
import { md5 } from '@web-clipper/shared';

const PAGE_LIMIT = 100;

export default class GithubDocumentService implements DocumentService {
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
    return md5(this.config.accessToken);
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

  getRepositories = async () => {
    let page = 1;
    let foo = await this.getGithubRepositories(page);
    let result: GithubRepository[] = [];
    result = result.concat(foo);
    while (foo.length === PAGE_LIMIT) {
      page++;
      foo = await this.getGithubRepositories(page);
      result = result.concat(foo);
    }
    this.repositories = result;
    return result.map(
      ({ id, name, groupId, groupName }): Repository => ({
        id,
        name,
        groupId,
        groupName,
      })
    );
  };

  createDocument = async (info: CreateDocumentRequest): Promise<CompleteStatus> => {
    if (!this.repositories) {
      this.getRepositories();
    }
    const { content: body, title, repositoryId } = info;
    const repository = this.repositories.find(o => o.id === repositoryId);
    if (!repository) {
      throw new Error('can not find repository');
    }
    const response = await this.request.post<{
      html_url: string;
      id: number;
    }>(`/repos/${repository.namespace}/issues`, {
      title,
      body,
    });
    return {
      href: response.data.html_url,
    };
  };

  private getGithubRepositories = async (page: number) => {
    const response = await this.request.get<GithubRepositoryResponse[]>(
      `user/repos?per_page=${PAGE_LIMIT}&page=${page}`
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
