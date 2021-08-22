import { IBackendService, SendToKindleRequestBody } from '@/services/backend/common/backend';
import { CompleteStatus } from 'common/backend/interface';
import { DocumentService, CreateDocumentRequest } from '../../index';
import { MailBackendServiceConfig } from './interface';
import Container from 'typedi';

export default class MailDocumentService implements DocumentService {
  private config: MailBackendServiceConfig;

  constructor({ to, domain }: MailBackendServiceConfig) {
    this.config = { to, domain };
  }

  getId = () => {
    return `${this.config.to}${this.config.domain}`;
  };

  getUserInfo = async () => {
    return {
      name: `Send to ${this.config.to}`,
      avatar: '',
      homePage: 'https://www.amazon.cn/hz/mycd/myx#/home/settings/payment',
      description: `send to ${this.config.to}`,
    };
  };

  getRepositories = async () => {
    return [
      {
        id: 'mail',
        name: `Send to ${this.config.to}${this.config.domain}`,
        groupId: 'mail',
        groupName: 'Mail',
      },
    ];
  };

  createDocument = async (info: CreateDocumentRequest): Promise<CompleteStatus> => {
    const postBody: SendToKindleRequestBody = {
      to: `${this.config.to}${this.config.domain}`,
      title: info.title,
      content: info.content,
    };
    Container.get(IBackendService).sentToKindle(postBody);
    return {
      href: `https://www.amazon.cn/hz/mycd/myx#/home/content/pdocs/dateDsc/`,
    };
  };
}
