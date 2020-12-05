import { DocumentService } from './../../index';
import {
  JoplinBackendServiceConfig,
  JoplinCreateDocumentRequest,
  IJoplinClient,
} from './interface';
import { LegacyJoplinClient } from './LegacyJoplinClient';
import { JoplinClient } from './JoplinClient';

const HOST = 'http://localhost:41184/';

export default class JoplinDocumentService implements DocumentService {
  private client?: Promise<IJoplinClient>;
  constructor(private config: JoplinBackendServiceConfig) {}

  getId() {
    return 'joplin';
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
      this.client = this._getJoplinClient();
    }
    return this.client;
  }

  private async _getJoplinClient(): Promise<IJoplinClient> {
    const client = new JoplinClient(this.config.token, HOST);
    if (await client.support()) {
      return client;
    }
    return new LegacyJoplinClient(this.config.token, HOST);
  }
}
