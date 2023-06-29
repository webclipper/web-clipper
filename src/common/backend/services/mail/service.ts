import { CompleteStatus } from 'common/backend/interface';
import { DocumentService } from '../../index';
import { MailBackendServiceConfig } from './interface';

export default class MailDocumentService implements DocumentService {
  private config: MailBackendServiceConfig;

  constructor({ to, home, html }: MailBackendServiceConfig) {
    this.config = { to, home, html };
  }

  getId = () => {
    return this.config.to;
  };

  getUserInfo = async () => {
    return {
      name: 'mail',
      avatar: '',
      homePage: this.config.home,
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

  createDocument = async (): Promise<CompleteStatus> => {
    throw new Error('send email is not supported yet');
  };
}
