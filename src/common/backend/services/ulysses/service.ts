import { ITabService } from './../../../../service/common/tab';
import { CompleteStatus } from 'common/backend/interface';
import { DocumentService, CreateDocumentRequest } from '../../index';
import Container from 'typedi';

export default class GithubDocumentService implements DocumentService {
  getId = () => {
    return 'ulysses';
  };

  getUserInfo = async () => {
    return {
      name: 'Ulysses',
      avatar: '',
      description: 'Ulysses app',
    };
  };

  getRepositories = async () => {
    return [
      {
        id: 'ulysses',
        name: 'Ulysses',
        groupId: 'ulysses',
        groupName: 'Ulysses',
      },
    ];
  };

  createDocument = async (info: CreateDocumentRequest): Promise<CompleteStatus> => {
    const text = `# ${info.title}\n\n${info.content}`;
    const url = `ulysses://x-callback-url/new-sheet?text=${encodeURIComponent(text)}`;
    Container.get(ITabService).create({ url });
    return {
      href: `ulysses://x-callback-url/open-recent`,
    };
  };
}
