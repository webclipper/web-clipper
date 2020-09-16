import { CompleteStatus, UnauthorizedError } from '../interface';
import { DocumentService, Repository, CreateDocumentRequest } from '../../index';
import localeService from '@/common/locales';
import short from 'short-uuid';
import { extend, RequestMethod } from 'umi-request';

interface WolaiUserContent {
  code: number;
  message: string;
  data: {
    spaceViews: {
      [uuid: string]: {
        id: string;
        user_id: string;
        workspace_id: string;
        created_time: number;
        notify_desktop: boolean;
        notify_email: boolean;
        notify_mobile: boolean;
        favorite_pages: any[];
      };
    };
    workspaces: {
      id: string;
      created_by: string;
      created_time: number;
      domain: string;
      edited_by: string;
      edited_time: number;
      icon: string;
      members: number;
      name: string;
      pages: string[];
      plan_type: string;
      team_type: string;
    }[];
    blocks: {
      [uuid: string]: {
        id: string;
        active: boolean;
        attributes: {
          title?: string[][];
        };
        created_by: string;
        created_time: number;
        edited_by: string;
        edited_time: number;
        parent_id: string;
        parent_type: string;
        permissions: {
          type: string;
          role: string;
          user_id: string;
        }[];
        sub_nodes: string[];
        text_content: string;
        type: string;
        ver: number;
        workspace_id: string;
        setting: {};
      };
    };
  };
}

interface WolaiUserInfo {
  code: number;
  data: {
    userId: string;
    mobile: string[];
    email: string;
    userName: string;
    avatar: string;
    userHash: string;
    recommendCode: string;
    registerTime: number;
    isNewUser: boolean;
    inviteRemainingCount: number;
    invitedUserCount: number;
  };
  message: string;
}

interface WolaiRepository extends Repository {
  pageType: string;
  spaceId: string;
}

const PAGE = 'page';

export default class WolaiDocumentService implements DocumentService {
  private request: RequestMethod;
  private repositories: WolaiRepository[];
  private userContent?: WolaiUserContent;
  private userInfo?: WolaiUserInfo;

  constructor() {
    const request = extend({
      prefix: 'https://api.wolai.com/',
      timeout: 10000,
      credentials: 'include',
    });
    this.request = request;
    this.repositories = [];
    request.interceptors.response.use(
      response => {
        if (response.clone().status === 401) {
          throw new UnauthorizedError(
            localeService.format({
              id: 'backend.services.wolai.unauthorizedErrorMessage',
              defaultMessage: 'Unauthorized! Please Login Wolai Web.',
            })
          );
        }
        return response;
      },
      { global: false }
    );
  }

  getUuid = () => {
    return short.generate();
  };

  getId = () => {
    return 'wolai';
  };

  getUserInfo = async () => {
    if (!this.userInfo) {
      this.userInfo = await this.fetchUserInfo();
    }
    const { email, userName } = this.userInfo.data;
    return {
      name: userName,
      avatar: '',
      homePage: 'https://www.wolai.com/',
      description: email,
    };
  };

  getRepositories = async () => {
    if (!this.userContent) {
      this.userContent = await this.getUserContent();
    }
    if (!this.userInfo) {
      this.userInfo = await this.fetchUserInfo();
    }

    const { blocks, workspaces } = this.userContent.data;

    if (!blocks) {
      this.repositories = [];
      return [];
    }

    const result: WolaiRepository[] = [];
    Object.values(blocks).forEach(value => {
      const space = workspaces.find(workspace => workspace.id === value.parent_id);
      if (value.type === PAGE && !!value.attributes && !!value.attributes.title && !!space) {
        result.push({
          id: value.id,
          spaceId: space.id,
          name: value.attributes.title.toString(),
          groupId: space.id,
          groupName: space.name,
          pageType: PAGE,
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
    const fileName = `${title}.md`;
    const filekey = `import/${this.getUuid()}/${fileName}`;

    const repository = this.repositories.find(o => o.id === repositoryId);
    if (!repository) {
      throw new Error('Illegal repository');
    }

    const documentId = await this.createEmptyFile(repository, title);

    const file = new File([content], filekey, {
      type: 'text/markdown',
    });
    const { code, data } = await this.getFileUrl(repository, file);

    if (code !== 1000) throw new Error('getSignedPostUrl error');

    const formData = new FormData();
    Object.keys(data.policyData.formData).forEach(key => {
      formData.append(key, data.policyData.formData[key]);
    });
    formData.append('key', filekey);
    formData.append('success_action_status', '200');
    formData.append('file', file);

    await extend({}).post(data.policyData.url, {
      data: formData,
    });

    await this.request.post('v1/import/getImportPageData', {
      data: {
        spaceId: repository.spaceId,
        type: 'string',
        bucket: data.policyData.bucket,
        filename: filekey,
        pageTitle: title,
        pageId: documentId,
      },
    });

    return {
      href: `https://www.wolai.com/${documentId}`,
    };
  };

  createEmptyFile = async (repository: WolaiRepository, title: string) => {
    const documentId = this.getUuid();
    const parentId = repository.id;
    const spaceId = repository.spaceId;
    const operations = {
      requestId: this.getUuid(),
      transactions: [
        {
          id: this.getUuid(),
          operations: [
            {
              id: documentId,
              table: 'wolai.block',
              path: [],
              command: 'set',
              args: {
                type: 'page',
                id: documentId,
                workspace_id: spaceId,
                parent_id: parentId,
                parent_type: 'page',
                active: true,
              },
              done: true,
            },
            {
              id: documentId,
              table: 'wolai.block',
              path: [],
              command: 'update',
              args: {
                sub_nodes: '[]',
                setting: '{}',
                page_id: parentId,
              },
              done: true,
            },
            {
              id: parentId,
              table: 'wolai.block',
              path: ['sub_nodes'],
              command: 'listAfter',
              args: {
                id: documentId,
              },
              done: true,
            },
            {
              id: documentId,
              table: 'wolai.block',
              path: ['attributes'],
              command: 'update',
              args: {
                title: [[title]],
              },
              done: true,
            },
            {
              id: documentId,
              table: 'wolai.block',
              path: [],
              command: 'update',
              args: {
                type: 'page',
              },
              done: true,
            },
          ],
        },
      ],
    };
    await this.request.post('v1/transaction/updateChanges', { data: operations });
    return documentId;
  };

  getFileUrl = async (repository: WolaiRepository, file: File) => {
    const result = await this.request.post('v1/file/getSignedPostUrl', {
      data: {
        spaceId: repository.spaceId,
        fileSize: file.size,
        type: 'import',
      },
    });
    return result;
  };

  private getUserContent = async () => {
    const response = await this.request.post<WolaiUserContent>('v1/transaction/getUserData');
    return response;
  };

  private fetchUserInfo = async () => {
    const response = await this.request.post<WolaiUserInfo>('v1/authentication/user/getUserInfo');
    return response;
  };
}
