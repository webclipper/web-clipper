import axios, { AxiosInstance } from 'axios';

interface GithubBackendServiceConfig {
  accessToken: string;
  baseURL: string;
}

interface UserInfoResponse {
  avatar_url: string;
  name: string;
  bio: string;
  html_url: string;
}
interface RepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  created_at: string;
  description: string;
  private: boolean;
}

export default class GithubDocumentService implements DocumentService {
  private request: AxiosInstance;
  private repositories: Repository[];
  private pageLimit = 100;

  constructor(config: GithubBackendServiceConfig) {
    const request = axios.create({
      baseURL: config.baseURL,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${config.accessToken}`,
      },
      timeout: 10000,
      transformResponse: [
        (data): any => {
          // 做任何你想要的数据转换
          return JSON.parse(data);
        },
      ],
      withCredentials: true,
    });
    this.request = request;
  }

  getUserInfo = async () => {
    const data = await this.request.get<UserInfoResponse>('user');
    const {
      name,
      avatar_url: avatar,
      html_url: homePage,
      bio: description,
    } = data.data;
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
    let result: Repository[] = [];
    result = result.concat(foo);

    while (foo.length === this.pageLimit) {
      page++;
      foo = await this.getGithubRepositories(page);
      result = result.concat(foo);
    }
    this.repositories = result;
    return result;
  };

  createDocument = async (info: CreateDocumentRequest) => {
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
      repositoryId,
      documentId: response.data.id.toString(),
    };
  };

  private getGithubRepositories = async (
    page: number
  ): Promise<Repository[]> => {
    const response = await this.request.get<RepositoryResponse[]>(
      `user/repos?per_page=${this.pageLimit}&page=${page}`
    );
    const repositories = response.data;
    return repositories.map(repository => {
      const {
        id,
        name,
        full_name: namespace,
        created_at: createdAt,
        description,
      } = repository;
      return {
        id: id.toString(),
        name,
        namespace,
        description,
        owner: namespace.split('/')[0],
        private: repository.private,
        createdAt,
      };
    });
  };
}
