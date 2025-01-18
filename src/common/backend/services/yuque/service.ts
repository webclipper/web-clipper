import { IBasicRequestService } from '@/service/common/request';
import { Container } from 'typedi';
import { RequestHelper } from '@/service/request/common/request';
import { DocumentService } from './../../index';
import { generateUuid } from '@web-clipper/shared/lib/uuid';
import * as qs from 'qs';
import md5 from '@web-clipper/shared/lib/md5';
import {
  YuqueBackendServiceConfig,
  YuqueUserInfoResponse,
  RepositoryType,
  YuqueRepositoryResponse,
  YuqueGroupResponse,
  YuqueCreateDocumentResponse,
  YuqueRepository,
  YuqueCompleteStatus,
  YuqueCreateDocumentRequest,
  YuqueUpdateTOCRequest,
} from './interface';

const HOST = 'https://www.yuque.com';
const BASE_URL = `${HOST}/api/v2/`;

export default class YuqueDocumentService implements DocumentService {
  private request: RequestHelper;
  private userInfo?: YuqueUserInfoResponse;
  private config: YuqueBackendServiceConfig;
  private repositories: YuqueRepository[];

  constructor({ accessToken, repositoryType = RepositoryType.all }: YuqueBackendServiceConfig) {
    this.config = { accessToken, repositoryType };
    this.request = new RequestHelper({
      baseURL: BASE_URL,
      headers: {
        'X-Auth-Token': accessToken,
      },
      request: Container.get(IBasicRequestService),
      interceptors: {
        response: e => (e as any).data,
      },
    });
    this.repositories = [];
  }

  getId = () => md5(this.config.accessToken);

  getUserInfo = async () => {
    if (!this.userInfo) {
      this.userInfo = await this.getYuqueUserInfo();
    }
    const { avatar_url: avatar, name, login, description } = this.userInfo;
    const homePage = `${HOST}/${login}`;
    return {
      avatar,
      name,
      homePage,
      description,
      login,
    };
  };

  getRepositories = async () => {
    let response: YuqueRepository[] = [];
    if (this.config.repositoryType !== RepositoryType.group) {
      if (!this.userInfo) {
        this.userInfo = await this.getYuqueUserInfo();
      }
      const repos = await this.getAllRepositories(false, this.userInfo.id, this.userInfo.name);
      response = response.concat(repos);
    }
    if (this.config.repositoryType !== RepositoryType.self) {
      const groups = await this.getUserGroups();
      for (const group of groups) {
        const repos = await this.getAllRepositories(true, group.id, group.name);
        response = response.concat(repos);
      }
    }
    this.repositories = response;
    return response.map(({ namespace, ...rest }) => ({ ...rest }));
  };

  createDocument = async (info: YuqueCreateDocumentRequest): Promise<YuqueCompleteStatus> => {
    if (!this.userInfo) {
      this.userInfo = await this.getYuqueUserInfo();
    }
    const { content: body, title, repositoryId } = info;
    const repository = this.repositories.find(o => o.id === repositoryId);
    if (!repository) {
      throw new Error('illegal repositoryId');
    }
    const request = {
      title,
      slug: info.slug || generateUuid(),
      body,
      private: true,
    };
    const response = await this.request.post<YuqueCreateDocumentResponse>(
      `repos/${repositoryId}/docs`,
      {
        data: request,
      }
    );
    const data = response;

    await this.updateYuqueTOC({ repositoryId, documentId: [data.id] });

    return {
      href: `${HOST}/${repository.namespace}/${data.slug}`,
      repositoryId,
      documentId: data.id.toString(),
      accessToken: this.config.accessToken,
    };
  };

  private getUserGroups = async () => {
    if (!this.userInfo) {
      this.userInfo = await this.getYuqueUserInfo();
    }
    return this.request.get<YuqueGroupResponse[]>(`users/${this.userInfo.login}/groups`);
  };

  private getYuqueUserInfo = async () => {
    return this.request.get<YuqueUserInfoResponse>('user');
  };

  private getAllRepositories = async (isGroup: boolean, groupId: number, groupName: string) => {
    let offset = 0;
    let result = await this.getYuqueRepositories(offset, isGroup, String(groupId));
    while (result.length - offset === 20) {
      offset = offset + 20;
      result = result.concat(await this.getYuqueRepositories(offset, isGroup, String(groupId)));
    }
    return result.map(
      ({ id, name, namespace }): YuqueRepository => ({
        id: String(id),
        name,
        groupId: String(groupId),
        groupName: groupName,
        namespace,
      })
    );
  };

  private getYuqueRepositories = async (offset: number, isGroup: boolean, slug: string) => {
    const query = {
      offset: offset,
    };
    try {
      const response = await this.request.get<YuqueRepositoryResponse[]>(
        `${isGroup ? 'groups' : 'users'}/${slug}/repos?${qs.stringify(query)}`
      );
      return response;
    } catch (_error) {
      return [];
    }
  };

  private updateYuqueTOC = async (info: YuqueUpdateTOCRequest) => {
    const { repositoryId, documentId } = info;
    const requestBody = {
      action: 'prependNode',
      action_mode: 'child',
      doc_ids: documentId,
      type: 'DOC',
    };

    try {
      const response = await this.request.put(`repos/${repositoryId}/toc`, {
        data: requestBody,
			});
      return response;
    } catch (_error) {
      return {};
    }

  };
}
