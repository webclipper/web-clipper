import axios, { AxiosInstance } from 'axios';
import * as qs from 'qs';
import { UUID } from '../utils/uuid';

interface YuqueBackendServiceConfig {
  accessToken: string;
  baseURL: string;
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
    const index = config.baseURL.indexOf('/api/v2');
    if (index !== -1) {
      this.baseURL = config.baseURL.substring(0, index);
    } else {
      this.baseURL = config.baseURL;
    }
    const request = axios.create({
      baseURL: `${this.baseURL}/api/v2/`,
      headers: {
        'X-Auth-Token': config.accessToken
      },
      timeout: 10000,
      transformResponse: [
        (data): any => {
          // 做任何你想要的数据转换
          return JSON.parse(data).data;
        }
      ],
      withCredentials: true
    });
    this.request = request;
  }

  getUserInfo = async () => {
    const res = await this.request.get<UserInfoResponse>('user');
    const apiResponse = res.data;
    const { avatar_url: avatar, name, login, description } = apiResponse;
    this.login = login;
    return {
      name: name,
      avatar,
      homePage: `${this.baseURL}/${login}`,
      description
    };
  };

  getRepositories = async () => {
    const repositories = await this.getYuqueRepositories(0);
    this.repositories = repositories;
    return repositories;
  };

  createDocument = async (info: CreateDocumentRequest) => {
    if (!this.login) {
      await this.getUserInfo();
    }
    let slug = UUID.UUID();
    const { private: privateInfo, content: body, title, repositoryId } = info;
    let privateStatus = !privateInfo ? 1 : 0;
    const request = {
      title,
      slug,
      body,
      private: privateStatus
    };
    const response = await this.request.post<{
    id: number;
    slug: string;
    title: string;
    created_at: string;
    updated_at: string;
    }>(`/repos/${repositoryId}/docs`, qs.stringify(request));
    const data = response.data;
    const repository = this.repositories.find(
      (o: Repository) => o.id === repositoryId
    );
    if (!repository) {
      throw new Error('12323');
    }
    return {
      href: `${this.baseURL}/${repository.namespace}/${data.slug}`
    };
  };

  public async createRepository(info: any) {
    console.log(info);
  }
  public async getAbility() {
    return {
      document: {
        label: false,
        settingPermissions: false
      }
    };
  }

  private getYuqueRepositories = async (offset: number) => {
    if (!this.login) {
      await this.getUserInfo();
    }
    const query = {
      offset: offset
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
        description
      } = repository;
      return {
        id: id.toString(),
        name,
        namespace,
        description,
        owner: namespace.split('/')[0],
        private: !repository.public,
        createdAt
      };
    });
    return result;
  };
}
