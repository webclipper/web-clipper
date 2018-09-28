import { AxiosInstance } from 'axios';
import * as qs from 'qs';
import { RepoPublicType, RepoType } from '../../enums';
import * as _ from 'lodash';

export interface ReposConfig {
  name: string;
  public: RepoPublicType;
  slug: string;
  description?: string;
  type: RepoType;
}

export interface CreateUsersReposRequest {
  userid: number;
  repoConfig: ReposConfig;
}

export interface GetUserReposQuery {
  include_membered?: boolean;
  offset?: 0;
  type?: RepoType;
}

export interface BookSerializer {
  id: number;
  type: RepoType;
  description: string;
  name: string;
  slug: string;
  namespace: string;
  user_id: string; // 所属的团队/用户编号
  public: RepoPublicType;
}

export interface CreateBookResponse {
  id: number;
  type: RepoType;
  slug: string;
  name: string;
  user_id: string; // 所属的团队/用户编号
  public: RepoPublicType;
}

export interface ReposService {
  createUsersRepos(
    createUsersReposRequest: CreateUsersReposRequest,
  ): Promise<CreateBookResponse>;

  getUserRepos(userIdentity: string | number, query?: GetUserReposQuery): Promise<BookSerializer[]>;

  getRepoDetails(repoIdentity: string | number): Promise<BookSerializer>;

  deleteRepos(repoIdentity: string | number): Promise<any>;
}

export class ReposServiceImpl implements ReposService {
  private request: AxiosInstance;

  constructor(req: AxiosInstance) {
    this.request = req;
  }

  public async createUsersRepos(
    createUsersReposRequest: CreateUsersReposRequest,
  ): Promise<CreateBookResponse> {
    return this.request.post(`/users/${createUsersReposRequest.userid}/repos`,
      qs.stringify(createUsersReposRequest.repoConfig), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ).then((re) => {
      return Promise.resolve(re.data);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  public async getUserRepos(userIdentity: string | number, query: GetUserReposQuery): Promise<BookSerializer[]> {
    return this.request.get(`/users/${userIdentity}/repos?${qs.stringify(query)}`).then(
      re => {
        if (!_.isEmpty(re.data) && _.isArray(re.data)) {
          return Promise.resolve(re.data);
        }
        return Promise.resolve([]);
      }
    ).catch((err) => {
      return Promise.reject(err);
    });
  }

  public async getRepoDetails(repoIdentity: string | number): Promise<BookSerializer> {
    return this.request.get(`/repos/${repoIdentity}`).then(
      re => {
        return Promise.resolve(re.data);
      }
    ).catch((err) => {
      return Promise.reject(err);
    });
  }

  public async deleteRepos(repoIdentity: string | number): Promise<void> {
    return this.request.delete(`/repos/${repoIdentity}`).then(
      _ => {
        return Promise.resolve();
      }
    ).catch((err) => {
      return Promise.reject(err);
    });
  }

}
