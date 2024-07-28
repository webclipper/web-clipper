import md5 from '@web-clipper/shared/lib/md5';
import { CreateDocumentRequest, DocumentService } from '../../index';
import { ObsidianFormConfig } from './interface';
import QueryString from 'query-string';

export default class ObsidianService implements DocumentService {
  constructor(private config: ObsidianFormConfig) {}
  getId = () => {
    return md5(JSON.stringify(this.config));
  };

  getUserInfo = async () => {
    return {
      name: 'Obsidian',
      avatar: '',
      description: `Vault: ${this.config.vault}`,
    };
  };

  getRepositories = async () => {
    const folders = this.config.folder.split('\n').map((folder) => {
      return {
        id: folder,
        name: folder,
        groupId: 'obsidian',
        groupName: this.config.vault,
      };
    });
    return folders;
  };

  createDocument = async (info: CreateDocumentRequest) => {
    const file = `${info.repositoryId}/${info.title}`;
    window.open(
      QueryString.stringifyUrl({
        url: 'obsidian://new',
        query: {
          silent: true,
          vault: this.config.vault,
          file,
          content: info.content,
        },
      })
    );
    return {
      href: QueryString.stringifyUrl({
        url: 'obsidian://open',
        query: {
          vault: this.config.vault,
          file,
        },
      }),
    };
  };
}
