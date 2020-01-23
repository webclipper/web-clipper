import md5 from '@web-clipper/shared/lib/md5';
import {
  ConfluenceServiceConfig,
  ConfluenceUserInfo,
} from '@/common/backend/services/confluence/interface';
import { DocumentService } from '../../index';
import { extend, RequestMethod } from 'umi-request';

export default class GithubDocumentService implements DocumentService {
  private config: ConfluenceServiceConfig;
  private request: RequestMethod;

  constructor(config: ConfluenceServiceConfig) {
    this.config = config;
    this.request = extend({
      prefix: `${this.config.origin}/rest/api/`,
    });
  }

  getId = () => {
    return md5(`${this.config.origin}:${this.config.spaceId}`);
  };

  getUserInfo = async () => {
    const response = await this.request.get<ConfluenceUserInfo>('user/current');
    return {
      name: response.displayName,
      avatar: `${this.config.origin}${response.profilePicture.path}`,
      homePage: '',
      description: 'Confluence user',
    };
  };

  getRepositories = async () => {
    return [];
  };

  createDocument = async (): Promise<void> => {
    return;
  };
}
