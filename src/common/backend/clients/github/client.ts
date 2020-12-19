import { IRequest, RequestHelper } from '@/service/request/common/reqeust';
import { stringify } from 'qs';

export interface IGithubClientOptions {
  token: string;
  request: IRequest;
}
export interface ICreateIssueOptions {
  title: string;
  body: string;
  labels: string[];
  namespace: string;
}

export interface ICreateIssueResponse {
  html_url: string;
  id: number;
}

export class GithubClient {
  private options: IGithubClientOptions;
  private request: RequestHelper;

  constructor(options: IGithubClientOptions) {
    this.options = options;
    this.request = new RequestHelper({ request: this.options.request });
  }

  async createIssue(options: ICreateIssueOptions) {
    const data = { title: options.title, body: options.body, labels: options.labels };
    const response = await this.request.post<ICreateIssueResponse>(
      `/repos/${options.namespace}/issues`,
      { data, requestType: 'json', method: 'post' }
    );
    return response;
  }

  static get generateNewTokenUrl() {
    return `https://github.com/settings/tokens/new?${stringify({
      scopes: 'repo',
      description: 'Web Clipper',
    })}`;
  }
}
