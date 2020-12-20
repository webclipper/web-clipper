import { IExtendRequestHelper } from '@/service/common/request';
import { RequestHelper } from '@/service/request/common/request';
import { stringify } from 'qs';
import {
  ICreateIssueOptions,
  ICreateIssueResponse,
  IGithubClientOptions,
  IGithubUserInfoResponse,
  IUploadFileOptions,
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

  async createIssue(options: ICreateIssueOptions) {
    const data = { title: options.title, body: options.body, labels: options.labels };
    const response = await this.request.post<ICreateIssueResponse>(
      `repos/${options.namespace}/issues`,
      { data }
    );
    return response;
  }

  async getUserInfo() {
    return this.request.get<IGithubUserInfoResponse>('user');
  }

  /**
   * Create or update file contents
   *
   * @see https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-or-update-file-contents
   */
  async _uploadFile(_options: IUploadFileOptions) {
    throw new Error('TODO');
  }

  static get generateNewTokenUrl() {
    return `https://github.com/settings/tokens/new?${stringify({
      scopes: 'repo',
      description: 'Web Clipper',
    })}`;
  }
}
