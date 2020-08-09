import { DocumentService, CreateDocumentRequest } from './../../index';
import { extend, RequestMethod } from 'umi-request';
import md5 from '@web-clipper/shared/lib/md5';
import { BaklibBackendServiceConfig } from './interface';
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

  constructor({ accessToken }: BaklibBackendServiceConfig) {
    this.request = extend({
      prefix: 'https://www.baklib.com/api/',
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 5000,
    });
    this.request.interceptors.response.use(async response => {
      const json = await response.clone().json();
      if (json.code !== 0) {
        throw new Error(json.message);
      }
      return response;
    });
    this.token = accessToken;
  }

  getId = () => md5(this.token);

  getUserInfo = async () => {
    return {
      name: 'Baklib',
      avatar: '',
      homePage: 'https://www.baklib.com/-/groups',
      description: 'Baklib',
    };
  };

  getRepositories = async () => {
    const tenants = await this.request.get<{
      message: {
        mine: { id: string; name: string }[];
      };
    }>('v1/user/tenants');
    return tenants.message.mine.map(
      ({ id, name }): Repository => ({
        id,
        name,
        groupId: '',
        groupName: '站点',
      })
    );
  };

  async getTentChannel(tenant_id: string) {
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
    return channelToTree(message, '0');
  }

  createDocument = async (
    info: CreateDocumentRequest & {
      channel: string;
      tags: string;
      status: number;
      description: string;
    }
  ): Promise<CompleteStatus> => {
    const response = await this.request.post<{
      message: {
        id: string;
        frontend_url: string;
      };
    }>('v1/articles', {
      data: {
        content_type: 'markdown',
        tenant_id: info.repositoryId,
        name: info.title,
        channel_id: info.channel,
        tag_list: info.tags,
        content: info.content,
        status: info.status,
        description: info.description,
      },
    });
    return {
      href: response.message.frontend_url,
    };
  };
}
