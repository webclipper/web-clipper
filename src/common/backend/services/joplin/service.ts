import { Repository } from './../interface';
import { DocumentService } from './../../index';
import {
  JoplinBackendServiceConfig,
  JoplinFolderItem,
  JoplinTag,
  JoplinCreateDocumentRequest,
} from './interface';
import { extend, RequestMethod } from 'umi-request';

export default class JoplinDocumentService implements DocumentService {
  private request: RequestMethod;

  constructor(private config: JoplinBackendServiceConfig) {
    this.request = extend({
      prefix: 'http://localhost:41184/',
      params: {
        token: this.config.token,
      },
    });
  }

  getId() {
    return 'joplin';
  }

  getUserInfo = async () => {
    return {
      name: `Joplin`,
      avatar: '',
      homePage: 'https://joplinapp.org/',
      description: `Save to Joplin`,
    };
  };

  createDocument = async (data: JoplinCreateDocumentRequest) => {
    await this.request.post('notes', {
      data: {
        parent_id: data.repositoryId,
        title: data.title,
        body: data.content,
        tags: data.tags.join(','),
      },
    });
  };

  getRepositories = async () => {
    const repositories: Repository[] = [];
    const folders = await this.request.get<JoplinFolderItem[]>('folders');
    folders.forEach(folder => {
      repositories.push({
        id: folder.id,
        name: folder.title,
        groupId: folder.id,
        groupName: folder.title,
      });
      if (Array.isArray(folder.children)) {
        folder.children.forEach(subFolder => {
          repositories.push({
            id: subFolder.id,
            name: subFolder.title,
            groupId: folder.id,
            groupName: folder.title,
          });
        });
      }
    });
    return repositories;
  };

  getTags = async () => {
    let tags = await this.request.get<JoplinTag[]>('tags');
    if (this.config.filterTags) {
      tags = (
        await Promise.all(
          tags.map(async tag => {
            const notes = await this.request.get<unknown[]>(`tags/${tag.id}/notes`);
            if (notes.length === 0) {
              return null;
            }
            return tag;
          })
        )
      ).filter((tag): tag is JoplinTag => !!tag);
    }
    return tags;
  };
}
