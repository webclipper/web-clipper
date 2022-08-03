import { CompleteStatus, UnauthorizedError } from '../interface';
import { DocumentService, CreateDocumentRequest } from '../../index';
import localeService from '@/common/locales';
import { extend, RequestMethod } from 'umi-request';
import { IWebRequestService, WebBlockHeader } from '@/service/common/webRequest';
import Container from 'typedi';
import { ICookieService } from '@/service/common/cookie';
import {
  FlowUsToc,
  FlowUsRepository,
  FlowUsSpace,
  FlowUsUserInfo,
  Block,
  OSSInfo,
  TaskResult,
  FlowUsResponse,
  ROLE_WEIGHT,
  Share,
} from './type';
import { generateUuid } from '@web-clipper/shared/lib/uuid';
import { flowusOrigin } from '.';

export default class FlowUsDocumentService implements DocumentService {
  private request: RequestMethod;
  private repositories: FlowUsRepository[];
  private userSpaces?: FlowUsSpace;
  private tocPageBlocks?: Record<string, Block>;
  private userInfo?: FlowUsUserInfo;
  private webRequestService: IWebRequestService;
  private cookieService: ICookieService;

  constructor() {
    const request = extend({
      prefix: `${flowusOrigin}/api/`,
      timeout: 10000,
      credentials: 'include',
    });
    this.request = request;
    this.repositories = [];
    this.webRequestService = Container.get(IWebRequestService);
    this.cookieService = Container.get(ICookieService);

    request.interceptors.response.use(
      response => {
        if (response.status === 401) {
          throw new UnauthorizedError(
            localeService.format({
              id: 'backend.services.flowus.unauthorizedErrorMessage',
              defaultMessage: 'Unauthorized! Please Login FlowUs Web.',
            })
          );
        }
        return response;
      },
      { global: false }
    );
  }

  getId = () => {
    return 'FlowUs';
  };

  getUserInfo = async () => {
    if (!this.userInfo) {
      const res = await this.fetchUserInfo();
      this.userInfo = res.data;
    }
    const { nickname, avatar, ext } = this.userInfo;
    return {
      name: nickname,
      avatar: avatar?.startsWith('http') ? avatar : getImageCdnUrl(avatar),
      homePage: 'https://flowus.cn',
      description: ext?.email?.email,
    };
  };

  getRepositories = async () => {
    if (!this.userInfo) {
      const res = await this.fetchUserInfo();
      this.userInfo = res.data;
    }
    if (!this.userSpaces) {
      const res = await this.getUserSpaces();
      this.userSpaces = res.data;
    }

    const { spaceViews, spaces } = this.userSpaces;

    if (!spaceViews || !spaces) {
      this.repositories = [];
      return [];
    }

    const result: FlowUsRepository[] = [];
    //拉取可用空间
    const userSpaces = Object.values(spaceViews)
      .filter(spaceView => spaces[spaceView.spaceId])
      .map(spaceView => spaces[spaceView.spaceId]);

    if (!this.tocPageBlocks) {
      const allPromise = userSpaces.map(space => {
        return this.getSpaceRoot(space.uuid);
      });
      const allToc = await Promise.all(allPromise);
      this.tocPageBlocks = allToc.reduce((pre, cur) => {
        if (!cur.data.blocks) return pre;
        Object.values(cur.data.blocks).forEach(b => {
          //保存所有的页面/多维表块
          if ([0, 18, 19].includes(b.type)) {
            pre[b.uuid] = b;
          }
        });
        return pre;
      }, {} as Record<string, Block>);

      userSpaces.forEach(sp => {
        sp.subNodes.forEach(id => {
          const block = this.tocPageBlocks?.[id];
          if (!block) return;
          if (block.permissions.some(o => o.type === 'illegal')) return;
          if (block.permissions.length === 0) return;
          const { role } = getPermission(block, this.userInfo?.uuid!, sp.permissionGroups ?? []);
          if (role === 'editor' || role === 'writer') {
            //可保存到自页面的块
            const spaceId = block.spaceId ?? sp.uuid;
            let groupName = sp.title;
            result.push({
              id: block.uuid,
              name: block.title || '未命名页面',
              groupId: spaceId,
              groupName,
            });
          }
        });
      });
    }
    this.repositories = result;
    return result;
  };

  createDocument = async ({
    repositoryId,
    title,
    content,
  }: CreateDocumentRequest): Promise<CompleteStatus> => {
    const repository = this.repositories.find(o => o.id === repositoryId);
    if (!repository) {
      throw new Error('Illegal repository');
    }
    const documentId = await this.createEmptyPage(repository, title);
    const ossInfo = await this.requestWithCookie<FlowUsResponse<OSSInfo>>(header => {
      return this.request.post(`import_temp_file?source=web-clipper`, {
        headers: {
          [header.name]: header.value,
        },
        data: {
          content,
        },
      });
    });
    if (ossInfo.code !== 200) {
      throw new Error('upload md content failed');
    }
    //导入
    const res = await this.requestWithCookie<FlowUsResponse<{ taskId: string }>>(header => {
      return this.request.post('enqueueTask', {
        headers: {
          [header.name]: header.value,
        },
        data: {
          eventName: 'import',
          request: {
            blockId: documentId,
            spaceId: repository.groupId,
            importOptions: {
              type: 'markdown',
              ossName: ossInfo.data.ossName,
            },
          },
        },
      });
    });
    if (!res.data.taskId) {
      throw new Error('enqueueTask failed');
    }
    const taskId = res.data.taskId;

    const waitResult = async () => {
      await sleep(2000);
      const res = await this.requestWithCookie<FlowUsResponse<TaskResult>>(header => {
        return this.request.post('getTasks', {
          headers: {
            [header.name]: header.value,
          },
          data: {
            taskIds: [taskId],
          },
        });
      });
      if (res.code !== 200) {
        throw new Error('getTasks failed');
      }
      const result = res.data.results[taskId];
      if (result && result.status === 'success') {
        if (result.result?.status === 'success') {
          //do nothing
        } else if (result.result?.msg) {
          throw new Error(result.result?.msg);
        }
      } else {
        await waitResult();
      }
    };
    await waitResult();
    this.changeTitle(documentId, repository.groupId, title);
    return {
      href: `${flowusOrigin}/${documentId}`,
    };
  };

  createEmptyPage = async (repository: FlowUsRepository, title: string) => {
    if (!this.tocPageBlocks) {
      throw new Error('Illegal tocBlocks');
    }
    const documentId = generateUuid();
    const parentId = repository.id;
    const spaceId = repository.groupId;
    const blocks = this.tocPageBlocks;
    if (!blocks) {
      throw new Error('Illegal blocks');
    }
    const subNodes = blocks[parentId].subNodes;
    const after = subNodes[subNodes.length - 1];

    const operations = {
      requestId: generateUuid(),
      transactions: [
        {
          id: generateUuid(),
          spaceId,
          operations: [
            {
              id: documentId,
              path: [],
              command: 'set',
              table: 'block',
              args: {
                uuid: documentId,
                spaceId,
                parentId,
                textColor: '',
                backgroundColor: '',
                type: 0,
                status: 1,
                permissions: [],
                updateBy: this.userInfo?.uuid,
                updateAt: Date.now(),
                data: {
                  segments: [{ type: 0, text: title, enhancer: {} }],
                },
              },
            },
            {
              id: parentId,
              command: 'listAfter',
              path: ['subNodes'],
              table: 'block',
              args: {
                uuid: documentId,
                after,
              },
            },
          ],
        },
      ],
    };
    await this.requestWithCookie(header => {
      return this.request.post('blocks/transactions', {
        data: operations,
        headers: {
          [header.name]: header.value,
        },
      });
    });
    return documentId;
  };
  private changeTitle = async (documentId: string, spaceId: string, title: string) => {
    const operations = {
      requestId: generateUuid(),
      transactions: [
        {
          id: generateUuid(),
          spaceId,
          operations: [
            {
              id: documentId,
              path: ['data'],
              command: 'update',
              table: 'block',
              args: {
                segments: [{ type: 0, text: title, enhancer: {} }],
              },
            },
          ],
        },
      ],
    };
    await this.requestWithCookie(header => {
      return this.request.post('blocks/transactions', {
        data: operations,
        headers: {
          [header.name]: header.value,
        },
      });
    });
  };

  private getUserSpaces = async () => {
    return this.requestWithCookie<FlowUsResponse<FlowUsSpace>>(header => {
      return this.request.get(`users/${this.userInfo?.uuid}/root`, {
        headers: {
          [header.name]: header.value,
        },
      });
    });
  };
  private getSpaceRoot = async (spaceId: string) => {
    return this.requestWithCookie<FlowUsToc>(header => {
      return this.request.get<FlowUsToc>(`spaces/${spaceId}/root`, {
        headers: {
          [header.name]: header.value,
        },
      });
    });
  };

  private fetchUserInfo = async () => {
    return this.requestWithCookie<FlowUsResponse<FlowUsUserInfo>>(header => {
      return this.request.get('users/me', {
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
      url: flowusOrigin,
    });
    const cookieString = cookies.map(o => `${o.name}=${o.value}`).join(';');
    const header = await this.webRequestService.startChangeHeader({
      urls: [`${flowusOrigin}*`],
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

const compressImageSupport = /^(jpg|jpeg|png|bmp|webp|tiff)$/i;
function getImageCdnUrl(ossName?: string) {
  if (!ossName) return '';
  const index = ossName.lastIndexOf('.');
  const extName = ossName.substring(index + 1);
  let imgProcess = '';
  if (compressImageSupport.test(extName.toLocaleLowerCase())) {
    imgProcess = `img_process=/resize,w_${500 * Math.ceil(window.devicePixelRatio)}/quality,q_80/`;
  }
  return `https://cdn.allflow.cn/${ossName}?${imgProcess}`;
}
const sleep = (durationInMs: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, durationInMs);
  });
};

const getPermission = (block: Block, userId: string, permissionGroups: any[]) => {
  const data: Share = {
    shared: false,
    illegal: false,
    isRestricted: false,
    allowDuplicate: true,
    permissions: [],
    role: 'none',
    roleWithoutPublic: 'none',
  };
  if (block.permissions.length) {
    const getBiggerRole = (
      type: keyof Block['permissions'][0],
      value: any,
      role?: keyof typeof ROLE_WEIGHT
    ) => {
      const permissions = block.permissions.find(p => p[type] === value);
      if (
        permissions &&
        role &&
        permissions.role &&
        ROLE_WEIGHT[permissions.role] > ROLE_WEIGHT[role]
      ) {
        return permissions;
      }
    };
    const newPermissions = block.permissions
      .filter(o => {
        return o.type !== 'illegal' && o.type !== 'restricted';
      })
      .map(o => {
        if (o.type === 'space') {
          return getBiggerRole('type', o.type, o.role) || o;
        }
        if (o.type === 'group') {
          return getBiggerRole('groupId', o.groupId, o.role) || o;
        }
        if (o.type === 'user') {
          return getBiggerRole('userId', o.userId, o.role) || o;
        }
        return o;
      });
    const diffPermissions = block.permissions.filter(o => {
      if (o.type === 'illegal' || o.type === 'restricted') {
        return false;
      }
      if (o.type === 'space' || o.type === 'public') {
        return newPermissions.every(p => p.type !== o.type);
      }
      if (o.type === 'group') {
        return newPermissions.every(p => p.groupId !== o.groupId);
      }
      return newPermissions.every(p => p.userId !== o.userId);
    });
    data.permissions = [...newPermissions, ...diffPermissions];
    const ownPermission = data.permissions.find(p => p.userId === userId);
    const groupPermissions = data.permissions.filter(p => {
      const group = permissionGroups?.find(g => g.id === p.groupId);
      return group?.userIds.includes(userId);
    });
    const allPermissions = [ownPermission, ...groupPermissions];
    const spacePermission = block.permissions.find(p => p.type === 'space');
    allPermissions.push(spacePermission);
    data.roleWithoutPublic = allPermissions.reduce(
      (pre: keyof typeof ROLE_WEIGHT, permission: Block['permissions'][0] | undefined) => {
        if (!permission) return pre;
        const role = permission.role ?? 'none';
        return ROLE_WEIGHT[role] > ROLE_WEIGHT[pre] ? role : pre;
      },
      'none'
    );
    data.role = data.roleWithoutPublic;
  }

  return data;
};
