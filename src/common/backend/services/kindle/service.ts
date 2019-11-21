import { SendToKindleRequestBody, sentToKindle } from './../../../server';
import { CompleteStatus } from 'common/backend/interface';
import { DocumentService, CreateDocumentRequest } from '../../index';
import { MailBackendServiceConfig } from './interface';

export default class MailDocumentService implements DocumentService {
  private config: MailBackendServiceConfig;

  constructor({ to }: MailBackendServiceConfig) {
    this.config = { to };
  }

  getId = () => {
    return this.config.to;
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
        name: `Send to ${this.config.to}`,
        groupId: 'mail',
        groupName: 'Mail',
      },
    ];
  };

  createDocument = async (info: CreateDocumentRequest): Promise<CompleteStatus> => {
    const postBody: SendToKindleRequestBody = {
      to: this.config.to,
      title: info.title,
      content: info.content,
    };
    await sentToKindle(postBody);
    return {
      href: `https://www.amazon.cn/hz/mycd/myx#/home/settings/payment`,
    };
  };
}
