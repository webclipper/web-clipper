import { RequestHelper } from '@/service/request/common/request';
import { IBasicRequestService } from './../../../../service/common/request';
import { Container } from 'typedi';
import { DocumentService } from './../../index';

import {
  LegacyJoplinClient,
  JoplinClient,
  JoplinBackendServiceConfig,
  JoplinCreateDocumentRequest,
  IJoplinClient,
} from '../../clients/joplin';

const HOST = 'http://localhost:41184/';

export default class JoplinDocumentService implements DocumentService {
  private client?: Promise<IJoplinClient>;
  constructor(private config: JoplinBackendServiceConfig) {}

  getId() {
    return this.config.token;
  }

  getUserInfo = async () => {
    return {
      name: `Joplin`,
      avatar: '',
      homePage: 'https://joplinapp.org/',
      description: `Save to Joplin`,
    };
  };

  createDocument = async (data: JoplinCreateDocumentRequest) => {
    const joplinClient = await this.getJoplinClient();
    return joplinClient.createDocument(data);
  };

  getRepositories = async () => {
    const joplinClient = await this.getJoplinClient();
    return joplinClient.getRepositories();
  };

  getTags = async () => {
    const joplinClient = await this.getJoplinClient();
    return joplinClient.getTags(this.config.filterTags);
  };

  private async getJoplinClient(): Promise<IJoplinClient> {
    if (!this.client) {
      this.client = this.getSupportToken();
    }
    return this.client;
  }

  private async getSupportToken() {
    const tokens = this.config.token
      .split('\n')
      .map(o => o.trim())
      .filter(p => !!p);
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      try {
        const client = await this._getJoplinClient(token);
        const repositories = await client.getRepositories();
        if (Array.isArray(repositories)) {
          console.log(`Check token ${i} success.`);
          return client;
        }
        return client;
      } catch (_error) {
        //
        console.log(`Check token ${i} error.`);
      }
    }

    throw new Error('invalid Token');
  }

  private async _getJoplinClient(token: string): Promise<IJoplinClient> {
    const request = new RequestHelper({
      baseURL: HOST,
      request: Container.get(IBasicRequestService),
      params: {
        token,
      },
    });
    const client = new JoplinClient(request);
    if (await client.support()) {
      return client;
    }
    return new LegacyJoplinClient(request);
  }
}
