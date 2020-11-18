import { CompleteStatus, UnauthorizedError } from '../interface';
import { DocumentService, CreateDocumentRequest } from '../../index';
import localeService from '@/common/locales';
import short from 'short-uuid';
import { extend, RequestMethod } from 'umi-request';
import { WolaiRepository, WolaiUserContent, WolaiUserInfo } from './type';
import { IWebRequestService, WebBlockHeader } from '@/service/common/webRequest';
import Container from 'typedi';
import { ICookieService } from '@/service/common/cookie';

const PAGE = 'page';
const origin = 'https://api.wolai.com/';

export default class WolaiDocumentService implements DocumentService {
  private request: RequestMethod;
  private repositories: WolaiRepository[];
  private userContent?: WolaiUserContent;
  private userInfo?: WolaiUserInfo;
  private webRequestService: IWebRequestService;
  private cookieService: ICookieService;

  constructor() {
    const request = extend({
      prefix: origin,
      timeout: 10000,
      credentials: 'include',
    });
    this.request = request;
    this.repositories = [];
    this.webRequestService = Container.get(IWebRequestService);
    this.cookieService = Container.get(ICookieService);
    /**
     * TODO handle error
     */
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
    await this.requestWithCookie(header => {
      //TODO fixme
      return extend({}).post(data.policyData.url, {
        headers: {
          [header.name]: header.value,
        },
        data: formData,
      });
    });
    await this.requestWithCookie(header => {
      return this.request.post('v1/import/getImportPageData', {
        headers: {
          [header.name]: header.value,
        },
        data: {
          spaceId: repository.spaceId,
          type: 'string',
          bucket: data.policyData.bucket,
          filename: filekey,
          pageTitle: title,
          pageId: documentId,
        },
      });
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
    await this.requestWithCookie(header => {
      return this.request.post('v1/transaction/updateChanges', {
        data: operations,
        headers: {
          [header.name]: header.value,
        },
      });
    });
    return documentId;
  };

  getFileUrl = async (repository: WolaiRepository, file: File) => {
    return this.requestWithCookie(header => {
      return this.request.post('v1/file/getSignedPostUrl', {
        headers: {
          [header.name]: header.value,
        },
        data: {
          spaceId: repository.spaceId,
          fileSize: file.size,
          type: 'import',
        },
      });
    });
  };

  private getUserContent = async () => {
    return this.requestWithCookie<WolaiUserContent>(header => {
      return this.request.post<WolaiUserContent>('v1/transaction/getUserData', {
        headers: {
          [header.name]: header.value,
        },
      });
    });
  };

  private fetchUserInfo = async () => {
    return this.requestWithCookie<WolaiUserInfo>(header => {
      return this.request.post<WolaiUserInfo>('v1/authentication/user/getUserInfo', {
        headers: {
          [header.name]: header.value,
        },
      });
    });
  };

  /**
   * Modify the cookie when request
   */
  private requestWithCookie = async <T>(
    requestFunction: (header: WebBlockHeader) => Promise<T>
  ) => {
    const cookies = await this.cookieService.getAll({
      url: origin,
    });
    const cookieString = cookies.map(o => `${o.name}=${o.value}`).join(';');
    const header = await this.webRequestService.startChangeHeader({
      urls: [`${origin}*`],
      requestHeaders: [
        {
          name: 'cookie',
          value: cookieString,
        },
      ],
    });
    try {
      const result = await requestFunction(header);
      await this.webRequestService.end(header);
      return result;
    } catch (error) {
      await this.webRequestService.end(header);
      throw error;
    }
  };
}
