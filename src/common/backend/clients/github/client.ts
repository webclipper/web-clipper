import { IExtendRequestHelper } from '@/service/common/request';
import { RequestHelper } from '@/service/request/common/request';
import { stringify } from 'qs';
import {
  ICreateIssueOptions,
  ICreateIssueResponse,
  IGithubClientOptions,
  IGithubUserInfoResponse,
  IUploadFileOptions,
  IUploadFileResponse,
  IListBranchesOptions,
  IBranch,
  TPageRequest,
  IPageQuery,
  TOmitPage,
  IGetGithubRepositoryOptions,
  IRepository,
} from './types';

export class GithubClient {
  private options: IGithubClientOptions;
  private request: IExtendRequestHelper;

  constructor(options: IGithubClientOptions) {
    this.options = options;
    this.request = new RequestHelper({
      baseURL: 'https://api.github.com/',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${this.options.token}`,
      },
      request: this.options.request,
    });
  }

  createIssue = async (options: ICreateIssueOptions) => {
    const data = { title: options.title, body: options.body, labels: options.labels };
    const response = await this.request.post<ICreateIssueResponse>(
      `repos/${options.namespace}/issues`,
      { data }
    );
    return response;
  };

  getUserInfo = () => {
    return this.request.get<IGithubUserInfoResponse>('user');
  };

  queryAll = async <O extends IPageQuery, T>(
    args: TOmitPage<O>,
    pageRequest: TPageRequest<O, T>
  ): Promise<T[]> => {
    const startPage: number = 1;
    const pageSize: number = 50;
    const baseArgs = { ...args, page: startPage, per_page: pageSize } as O;
    let result: T[] = [];
    while (true) {
      const response = await pageRequest(baseArgs);
      result = result.concat(response);
      if (response.length === pageSize) {
        baseArgs.page = baseArgs.page + 1;
        continue;
      }
      return result;
    }
  };

  /**
   * Create or update file contents
   *
   * @see https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-or-update-file-contents
   */
  uploadFile = (options: IUploadFileOptions) => {
    return this.request.put<IUploadFileResponse>(
      `repos/${options.owner}/${options.repo}/contents/${options.path}`,
      {
        data: {
          message: options.message,
          content: options.content,
          branch: options.branch,
        },
      }
    );
  };

  listBranch = (options: IListBranchesOptions) => {
    return this.request.get<IBranch[]>(
      `repos/${options.owner}/${options.repo}/branches?${stringify({
        protected: options.protected,
        per_page: options.per_page,
        page: options.page,
      })}`
    );
  };

  /**
   *
   * @see https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#list-repositories-for-the-authenticated-user
   * @param options IGetGithubRepositoryOptions
   */
  getRepos = (options: IGetGithubRepositoryOptions) => {
    return this.request.get<IRepository[]>(
      `user/repos?${stringify({
        affiliation: options.affiliation,
        per_page: options.per_page,
        type: options.type,
        page: options.page,
      })}`
    );
  };

  static get generateNewTokenUrl() {
    return `https://github.com/settings/tokens/new?${stringify({
      scopes: 'repo',
      description: 'Web Clipper',
    })}`;
  }
}
