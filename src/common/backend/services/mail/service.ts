import { Container } from 'typedi';
import { CompleteStatus } from 'common/backend/interface';
import { IBackendService, PostMailRequestBody } from '@/services/backend/common/backend';
import { DocumentService, CreateDocumentRequest } from '../../index';
import showdown from 'showdown';
import { MailBackendServiceConfig } from './interface';

const converter = new showdown.Converter();

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

  createDocument = async (info: CreateDocumentRequest): Promise<CompleteStatus> => {
    const postBody: PostMailRequestBody = {
      to: this.config.to,
      subject: info.title,
    };
    if (this.config.html) {
      postBody.html = converter.makeHtml(info.content);
    } else {
      postBody.text = info.content;
    }
    await Container.get(IBackendService).sendEmail(postBody);
    return {
      href: `https://${this.config.home}`,
    };
  };
}
