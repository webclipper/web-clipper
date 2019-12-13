import { DocumentService } from './../../index';
import axios, { AxiosInstance } from 'axios';
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
} from './interface';

const HOST = 'https://www.yuque.com';
const BASE_URL = `${HOST}/api/v2/`;

export default class YuqueDocumentService implements DocumentService {
  private request: AxiosInstance;
  private userInfo?: YuqueUserInfoResponse;
  private config: YuqueBackendServiceConfig;
  private repositories: YuqueRepository[];

  constructor({ accessToken, repositoryType = RepositoryType.all }: YuqueBackendServiceConfig) {
    this.config = { accessToken, repositoryType };
    this.request = axios.create({
      baseURL: BASE_URL,
      headers: { 'X-Auth-Token': accessToken },
      timeout: 5000,
      transformResponse: [data => JSON.parse(data).data],
      withCredentials: true,
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
      `/repos/${repositoryId}/docs`,
      qs.stringify(request)
    );
    const data = response.data;
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
    return (await this.request.get<YuqueGroupResponse[]>(`users/${this.userInfo.login}/groups`))
      .data;
  };

  private getYuqueUserInfo = async () => {
    const response = await this.request.get<YuqueUserInfoResponse>('user');
    return response.data;
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
      return response.data;
    } catch (_error) {
      return [];
    }
  };
}
