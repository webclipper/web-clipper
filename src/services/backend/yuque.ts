import axios, { AxiosInstance } from 'axios';
import * as qs from 'qs';

interface YuqueBackendServiceConfig {
  accessToken: string;
  baseURL: string;
}

interface UserInfoResponse {
  id: number;
  avatar_url: string;
  name: string;
  login: string;
}
interface RepositoryResponse {
  id: number;
  name: string;
  description: string;
  public: 0 | 1;
  namespace: string;
  created_at: string;
}

export default class YuqueBackendService implements BackendService {
  private request: AxiosInstance;
  private baseURL: string;
  private login?: string;

  constructor(config: YuqueBackendServiceConfig) {
    const request = axios.create({
      baseURL: config.baseURL,
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
    this.baseURL = config.baseURL;
  }

  getUserInfo = async () => {
    const res = await this.request.get<UserInfoResponse>('/user');
    const apiResponse = res.data;
    const { avatar_url, name, login } = apiResponse;
    this.login = login;
    const index = this.baseURL.lastIndexOf('/api/v2');
    let host = this.baseURL;
    if (index !== -1) {
      host = host.substring(0, index);
    }
    return {
      name: name,
      avatar: avatar_url,
      homePage: `${host}/${login}`
    };
  };

  getRepositories = async () => {
    return this.getYuqueRepositories(0);
  };
  public async createDocument(info: any) {
    console.log(info);
  }
  public async createRepository(info: any) {
    console.log(info);
  }
  private getYuqueRepositories = async (offset: number) => {
    if (!this.login) {
      await this.getUserInfo();
    }
    const query = {
      offset: offset
    };
    const response = await this.request.get<RepositoryResponse[]>(
      `/users/${this.login}/repos?${qs.stringify(query)}`
    );
    const repositories = response.data;
    const result = repositories.map(repository => {
      const { id, name, namespace, created_at, description } = repository;
      return {
        id: id.toString(),
        name,
        namespace,
        description,
        owner: namespace.split('/')[0],
        private: !repository.public,
        createdAt: created_at
      };
    });
    return result;
  };
}
