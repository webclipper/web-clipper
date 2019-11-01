import { CompleteStatus } from 'common/backend/interface';
import { DocumentService, CreateDocumentRequest } from '../../index';

export default class GithubDocumentService implements DocumentService {
  getId = () => {
    return 'bear';
  };

  getUserInfo = async () => {
    return {
      name: 'BEAR',
      avatar: '',
      homePage: 'bear://x-callback-url/search',
      description: 'Bear app',
    };
  };

  getRepositories = async () => {
    return [
      {
        id: 'bear',
        name: 'Bear',
        groupId: 'bear',
        groupName: 'Bear',
      },
    ];
  };

  createDocument = async (info: CreateDocumentRequest): Promise<CompleteStatus> => {
    const url = `bear://x-callback-url/create?title=${encodeURIComponent(
      info.title
    )}&text=${encodeURIComponent(info.content)}&open_note=no`;
    window.location.href = url;
    return {
      href: `bear://x-callback-url/open-note?title=${info.title}`,
    };
  };
}
