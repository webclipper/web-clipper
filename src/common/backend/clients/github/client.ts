import { stringify } from 'qs';

export interface IGithubClientOptions {
  token: string;
}

export class GithubClient {
  private options: IGithubClientOptions;

  constructor(options: IGithubClientOptions) {
    this.options = options;
    console.log(this.options);
  }

  static get generateNewTokenUrl() {
    return `https://github.com/settings/tokens/new?${stringify({
      scopes: 'repo',
      description: 'Web Clipper',
    })}`;
  }
}
