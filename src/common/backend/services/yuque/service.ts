import { DocumentService, CreateDocumentRequest } from './../../index';
import axios, { AxiosInstance } from 'axios';
import { generateUuid } from '../../../../common/uuid';
import * as qs from 'qs';

interface YuqueBackendServiceConfig {
  accessToken: string;
  host: string;
}

interface UserInfoResponse {
  id: number;
  avatar_url: string;
  name: string;
  login: string;
  description: string;
}
interface RepositoryResponse {
  id: number;
  name: string;
  description: string;
  public: 0 | 1;
  namespace: string;
  created_at: string;
}

export default class YuqueDocumentService implements DocumentService {
  private request: AxiosInstance;
  private baseURL: string;
  private login?: string;
  private repositories: Repository[];

  constructor(config: YuqueBackendServiceConfig) {
    const index = config.host.indexOf('/api/v2');
    if (index !== -1) {
      this.baseURL = config.host.substring(0, index);
    } else {
      this.baseURL = config.host;
    }
    const request = axios.create({
      baseURL: `${this.baseURL}/api/v2/`,
      headers: {
        'X-Auth-Token': config.accessToken,
      },
      timeout: 10000,
      transformResponse: [
        (data): any => {
          // 做任何你想要的数据转换
          return JSON.parse(data).data;
        },
      ],
      withCredentials: true,
    });
    this.request = request;
    this.repositories = [];
  }

  getUserInfo = async () => {
    const res = await this.request.get<UserInfoResponse>('user');
    const apiResponse = res.data;
    const { avatar_url: avatar, name, login, description } = apiResponse;
    this.login = login;
    return {
      avatar,
      name: name,
      homePage: `${this.baseURL}/${login}`,
      description,
    };
  };

  getRepositories = async () => {
    let offset = 0;
    let foo = await this.getYuqueRepositories(offset);
    let result: Repository[] = [];
    result = result.concat(foo);
    while (foo.length === 20) {
      offset = offset + 20;
      foo = await this.getYuqueRepositories(offset);
      result = result.concat(foo);
    }
    this.repositories = result;
    return result;
  };

  createDocument = async (info: CreateDocumentRequest) => {
    if (!this.login) {
      await this.getUserInfo();
    }
    let slug = generateUuid();
    const { private: privateInfo, content: body, title, repositoryId } = info;
    let privateStatus = !privateInfo ? 1 : 0;
    const request = {
      title,
      slug,
      body,
      private: privateStatus,
    };
    const repository = this.repositories.find(
      (o: Repository) => o.id === repositoryId
    );
    if (!repository) {
      throw new Error('illegal repositoryId');
    }
    const response = await this.request.post<{
      id: number;
      slug: string;
      title: string;
      created_at: string;
      updated_at: string;
    }>(`/repos/${repositoryId}/docs`, qs.stringify(request));
    const data = response.data;
    return {
      href: `${this.baseURL}/${repository.namespace}/${data.slug}`,
      repositoryId,
      documentId: data.id.toString(),
    };
  };

  public async createRepository(info: any) {
    console.log(info);
  }
  public async getAbility() {
    return {
      document: {
        label: false,
        settingPermissions: false,
      },
    };
  }

  private getYuqueRepositories = async (offset: number) => {
    if (!this.login) {
      await this.getUserInfo();
    }
    const query = {
      offset: offset,
    };
    const response = await this.request.get<RepositoryResponse[]>(
      `users/${this.login}/repos?${qs.stringify(query)}`
    );
    const repositories = response.data;
    const result = repositories.map(repository => {
      const {
        id,
        name,
        namespace,
        created_at: createdAt,
        description,
      } = repository;
      return {
        id: id.toString(),
        name,
        namespace,
        description,
        owner: namespace.split('/')[0],
        private: !repository.public,
        createdAt,
      };
    });
    return result;
  };
}
