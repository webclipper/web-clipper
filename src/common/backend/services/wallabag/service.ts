import { DocumentService, CreateDocumentRequest, UserInfo } from './../../index';
import md5 from '@web-clipper/shared/lib/md5';
import { CompleteStatus } from '../interface';
import WallabagClient from 'common/backend/clients/wallabag/client';
import { Container } from 'typedi';
import { IBasicRequestService } from '@/service/common/request';
import { WallabagBackendServiceConfig } from 'common/backend/clients/wallabag/interface';

export default class WallabagDocumentService implements DocumentService {
  private client: WallabagClient;
  private config: WallabagBackendServiceConfig;

  constructor(config: WallabagBackendServiceConfig) {
    this.config = config;
    this.client = new WallabagClient(config, Container.get(IBasicRequestService));
  }

  getId = () => md5(`wallabag_${this.config.wallabag_host}`);

  getUserInfo = async (): Promise<UserInfo> => {
    let response = await this.client.getUserInfo();
    return {
      name: response.username,
      avatar: '',
    };
  };

  getRepositories = async () => {
    let userInfo = await this.getUserInfo();
    return [
      {
        id: 'wallabag',
        name: `Wallabag for ${userInfo.name}`,
        groupId: 'wallabag',
        groupName: 'Wallabag',
      },
    ];
  };

  createDocument = async (
    info: CreateDocumentRequest & {
      channel: string;
      status: number;
    }
  ): Promise<CompleteStatus> => {
    const document = await this.client.createDocument(info);
    return {
      href: `${this.config.wallabag_host}/view/${encodeURIComponent(document.id)}`,
    };
  };
}
