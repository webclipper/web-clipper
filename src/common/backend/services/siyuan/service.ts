import { Repository, CreateDocumentRequest } from './../interface';
import { DocumentService } from '../../index';
import { IBasicRequestService } from '@/service/common/request';
import { Container } from 'typedi';
import { SiYuanClient } from '../../clients/siyuan/client';

/**
 *
 * Document service for self hosted leanote or leanote.com
 */
export default class LeanoteDocumentService implements DocumentService {
  private client: SiYuanClient;
  constructor() {
    this.client = new SiYuanClient({ request: Container.get(IBasicRequestService) });
  }

  /** Unique account identification */
  getId = () => {
    return 'siyuan';
  };

  getUserInfo = async () => {
    return {
      name: 'siyuan',
      avatar: '',
      homePage: '',
      description: ``,
    };
  };

  getRepositories = async () => {
    let response = await this.client.listNotebooks();
    console.log('response', response);
    return response.map(
      (name): Repository => {
        return {
          groupId: 'siyuan',
          groupName: '笔记本',
          id: name,
          name: name,
        };
      }
    );
  };

  createDocument = async (data: CreateDocumentRequest): Promise<void> => {
    await this.client.createNote(data);
  };
}
