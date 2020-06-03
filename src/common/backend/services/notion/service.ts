import { CompleteStatus, UnauthorizedError } from './../interface';
import { DocumentService, Repository, CreateDocumentRequest } from '../../index';
import axios, { AxiosInstance } from 'axios';
import { generateUuid } from '@web-clipper/shared/lib/uuid';
import localeService from '@/common/locales';

interface NotionUserContent {
  recordMap: {
    notion_user: {
      [uuid: string]: {
        role: string;
        value: {
          id: string;
          email: string;
          given_name: string;
          family_name: string;
          profile_photo: string;
        };
      };
    };
    space: {
      [id: string]: {
        role: string;
        value: {
          id: string;
          name: string;
          domain: string;
          pages: string[];
        };
      };
    };
    block: {
      [uuid: string]: {
        role: string;
        value: {
          id: string;
          version: string;
          parent_id: string;
          type: string;
          created_time: number;
          properties: {
            title: string[][];
            content: string[];
          };
          collection_id: string;
        };
      };
    };
    collection: {
      [uuid: string]: {
        role: string;
        value: {
          id: string;
          version: string;
          parent_id: string;
          name: string[][];
        };
      };
    };
  };
}

interface NotionRepository extends Repository {
  pageType: string;
}

const PAGE = 'page';
const COLLECTION_VIEW_PAGE = 'collection_view_page';

export default class NotionDocumentService implements DocumentService {
  private request: AxiosInstance;
  private repositories: NotionRepository[];
  private userContent?: NotionUserContent;

  constructor() {
    const request = axios.create({
      baseURL: 'https://www.notion.so/',
      timeout: 10000,
      transformResponse: [
        (data): any => {
          return JSON.parse(data);
        },
      ],
      withCredentials: true,
    });
    this.request = request;
    this.repositories = [];
    this.request.interceptors.response.use(
      r => r,
      error => {
        if (error.response && error.response.status === 401) {
          return Promise.reject(
            new UnauthorizedError(
              localeService.format({
                id: 'backend.services.notion.unauthorizedErrorMessage',
                defaultMessage: 'Unauthorized! Please Login Notion Web.',
              })
            )
          );
        }
        return Promise.reject(error);
      }
    );
  }

  getId = () => {
    return 'notion';
  };

  getUserInfo = async () => {
    if (!this.userContent) {
      this.userContent = await this.getUserContent();
    }
    const user = this.userContent.recordMap.notion_user;
    const userInfo = Object.values(user)[0];
    const { email, profile_photo, given_name, family_name } = userInfo.value;
    return {
      name: `${given_name}${family_name}`,
      avatar: profile_photo,
      homePage: 'https://www.notion.so/',
      description: email,
    };
  };

  getRepositories = async () => {
    if (!this.userContent) {
      this.userContent = await this.getUserContent();
    }

    const spaces = this.userContent.recordMap.space;
    const blocks = this.userContent.recordMap.block;
    const collections = this.userContent.recordMap.collection;

    if (!blocks) {
      this.repositories = [];
      return [];
    }

    const result: NotionRepository[] = [];
    Object.values(blocks).forEach(({ value }) => {
      if (
        value.type === PAGE &&
        !!value.properties &&
        !!value.properties.title &&
        !!spaces[value.parent_id]
      ) {
        result.push({
          id: value.id,
          name: value.properties.title.toString(),
          groupId: spaces[value.parent_id].value.domain,
          groupName: spaces[value.parent_id].value.name,
          pageType: PAGE,
        });
      }

      if (
        value.type === COLLECTION_VIEW_PAGE &&
        !!value.collection_id &&
        !!collections[value.collection_id] &&
        !!collections[value.collection_id].value &&
        !!collections[value.collection_id].value.name &&
        !!spaces[value.parent_id]
      ) {
        result.push({
          id: collections[value.collection_id].value.id,
          name: collections[value.collection_id].value.name.toString(),
          groupId: spaces[value.parent_id].value.domain,
          groupName: spaces[value.parent_id].value.name,
          pageType: COLLECTION_VIEW_PAGE,
        });
      }
    });

    this.repositories = result;

    return result;
  };

  createDocument = async ({
    repositoryId,
    title,
    content,
  }: CreateDocumentRequest): Promise<CompleteStatus> => {
    let fileName = `${title}.md`;

    const repository = this.repositories.find(o => o.id === repositoryId);
    if (!repository) {
      throw new Error('Illegal repository');
    }

    const documentId = await this.createEmptyFile(repository, content);
    const fileUrl = await this.getFileUrl(fileName);
    await axios.put(fileUrl.signedPutUrl, `${content}`, {
      headers: {
        'Content-Type': 'text/markdown',
      },
    });
    await this.request.post('api/v3/enqueueTask', {
      task: {
        eventName: 'importFile',
        request: {
          fileURL: fileUrl.url,
          fileName,
          importType: 'ReplaceBlock',
          pageId: documentId,
        },
      },
    });

    return {
      href: `https://www.notion.so/${repository.groupId}/${documentId.replace(/-/g, '')}`,
    };
  };

  createEmptyFile = async (repository: NotionRepository, title: string) => {
    if (!this.userContent) {
      this.userContent = await this.getUserContent();
    }
    const documentId = generateUuid();
    const parentId = repository.id;
    const userId = Object.values(this.userContent.recordMap.notion_user)[0].value.id;
    const time = new Date().getDate();
    let operations;
    if (repository.pageType === PAGE) {
      operations = [
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'set',
          args: {
            type: 'page',
            id: documentId,
            version: 1,
          },
        },
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'update',
          args: {
            parent_id: parentId,
            parent_table: 'block',
            alive: true,
          },
        },
        {
          table: 'block',
          id: parentId,
          path: ['content'],
          command: 'listAfter',
          args: { id: documentId },
        },
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'update',
          args: {
            created_by: userId,
            created_time: time,
            last_edited_time: time,
            last_edited_by: userId,
          },
        },
        {
          id: parentId,
          table: 'block',
          path: [],
          command: 'update',
          args: { last_edited_time: time },
        },
        {
          id: documentId,
          table: 'block',
          path: ['properties', 'title'],
          command: 'set',
          args: [[title]],
        },
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'update',
          args: { last_edited_time: time },
        },
      ];
    } else if (repository.pageType === COLLECTION_VIEW_PAGE) {
      operations = [
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'set',
          args: {
            type: 'page',
            id: documentId,
            version: 1,
          },
        },
        {
          id: documentId,
          table: 'block',
          path: [],
          command: 'update',
          args: {
            parent_id: parentId,
            parent_table: 'collection',
            alive: true,
          },
        },
      ];
    }

    await this.request.post('api/v3/submitTransaction', {
      operations,
    });
    return documentId;
  };

  getFileUrl = async (fileName: string) => {
    const result = await this.request.post<{
      url: string;
      signedPutUrl: string;
    }>('api/v3/getUploadFileUrl', {
      bucket: 'temporary',
      name: fileName,
      contentType: 'text/markdown',
    });
    return result.data;
  };

  private getUserContent = async () => {
    const response = await this.request.post<NotionUserContent>('api/v3/loadUserContent');
    return response.data;
  };
}
