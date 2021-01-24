import { DocumentService, CreateDocumentRequest } from './../../index';
import { extend, RequestMethod } from 'umi-request';
import md5 from '@web-clipper/shared/lib/md5';
import { BaklibBackendServiceConfig, BaklibTenantsResponse } from './interface';
import { CompleteStatus, Repository } from '../interface';

interface Channel {
  id: string;
  name: string;
  ordinal: number;
  child_channels: Channel[];
}

export default class BaklibDocumentService implements DocumentService {
  private request: RequestMethod;
  private token: string;
  private cache: Map<string, any>;

  constructor({ accessToken }: BaklibBackendServiceConfig) {
    this.request = extend({
      prefix: 'https://www.baklib-free.com/api/',
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 5000,
    });
    this.request.interceptors.response.use(
      async response => {
        const json = await response.clone().json();
        if (json.code !== 0) {
          throw new Error(json.message);
        }
        return response;
      },
      { global: false }
    );
    this.token = accessToken;
    this.cache = new Map<string, any>();
  }

  getId = () => md5(this.token);

  getUserInfo = async () => {
    return {
      name: 'Baklib',
      avatar: '',
      homePage: 'https://www.baklib-free.com/-/groups',
      description: 'Baklib',
    };
  };

  getRepositories = async () => {
    const {
      message: { current_tenants, share_tenants },
    } = await this.request.get<{
      message: BaklibTenantsResponse;
    }>('v1/tenants');
    function tenantToRepo(tenants: any, groupName: string) {
      return tenants.map(
        ({ id, name, member_role }: any): Repository => {
          const readOnly = Array.isArray(member_role) && member_role[0] === '只能阅读';
          return {
            id,
            name: readOnly ? `${name} (只读)` : name,
            disabled: readOnly,
            groupId: groupName,
            groupName,
          };
        }
      );
    }
    return tenantToRepo(current_tenants, '我的站点').concat(
      tenantToRepo(share_tenants, '共享站点')
    );
  };

  async getTentChannel(tenant_id: string) {
    if (this.cache.has(tenant_id)) {
      return this.cache.get(tenant_id);
    }
    const response = await this.request.get<{
      message: Channel[];
    }>(`v1/channels?tenant_id=${tenant_id}`);
    const { message } = response;
    function channelToTree(tree: Channel[], parent: string): any {
      tree.sort((a, b) => a.ordinal - b.ordinal);
      return tree.map((o, index) => ({
        title: o.name,
        value: o.id,
        key: `${parent}-${index}`,
        children: channelToTree(o.child_channels, `${parent}-${index}`),
      }));
    }
    this.cache.set(tenant_id, channelToTree(message, '0'));
    return channelToTree(message, '0');
  }

  createDocument = async (
    info: CreateDocumentRequest & {
      channel: string;
      status: number;
    }
  ): Promise<CompleteStatus & { edit_url: string }> => {
    const response = await this.request.post<{
      message: {
        id: string;
        frontend_url: string;
        edit_url: string;
      };
    }>('v1/articles', {
      data: {
        content_type: 'markdown',
        tenant_id: info.repositoryId,
        name: info.title,
        channel_id: info.channel,
        content: info.content,
        status: 1,
      },
    });
    return {
      href: response.message.frontend_url,
      edit_url: response.message.edit_url,
    };
  };
}
