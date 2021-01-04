import { extend, RequestMethod } from 'umi-request';
import { Repository } from '../interface';
import {
  IJoplinClient,
  JoplinFolderItem,
  JoplinTag,
  JoplinCreateDocumentRequest,
  IPageRes,
} from './interface';

export class JoplinClient implements IJoplinClient {
  private request: RequestMethod;
  constructor(token: string, host: string) {
    this.request = extend({
      prefix: host,
      params: {
        token: token,
      },
    });
  }

  support = async (): Promise<boolean> => {
    let tags = await this.request.get<IPageRes<JoplinTag>>('tags');
    return typeof tags.has_more === 'boolean';
  };

  getRepositories = async () => {
    const repositories: Repository[] = [];
    const folders = await this.pageToAllList(this.getFolderByPageNumber);
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

  getTags = async (filterTags: boolean) => {
    let tags = await this.pageToAllList<JoplinTag>(this.getTagsByPageNumber);
    if (filterTags) {
      tags = (
        await Promise.all(
          tags.map(async tag => {
            const notes = await this.request.get<unknown[]>(`tags/${tag.id}/notes`);
            console.log('notes', notes);
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

  createDocument = async (data: JoplinCreateDocumentRequest) => {
    await this.request.post('notes', {
      data: {
        parent_id: data.repositoryId,
        title: data.title,
        body: data.content,
        tags: data.tags.join(','),
        source_url: data.url,
      },
    });
  };

  private getTagsByPageNumber = async (page: number) => {
    return this.request.get<IPageRes<JoplinTag>>(`tags?page=${page}`);
  };

  private getFolderByPageNumber = async (page: number) => {
    return this.request.get<IPageRes<JoplinFolderItem>>(`folders?page=${page}`);
  };

  private pageToAllList = async <T>(
    getOnePage: (page: number) => Promise<IPageRes<T>>
  ): Promise<T[]> => {
    let hasMore = true;
    let startPageNumber = 1;
    let result: T[] = [];
    while (hasMore) {
      const response = await getOnePage(startPageNumber);
      result = result.concat(response.items);
      hasMore = response.has_more;
      startPageNumber++;
    }
    return result;
  };
}
