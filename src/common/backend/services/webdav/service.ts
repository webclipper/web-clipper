import { WebDAVServiceConfig } from './interface';
import { DocumentService, CreateDocumentRequest, Repository } from './../interface';
import { extend, RequestMethod } from 'umi-request';

export default class WebDAVDocumentService implements DocumentService {
  private auth: string;
  private request: RequestMethod;

  constructor(private config: WebDAVServiceConfig) {
    this.auth = btoa(`${this.config.username}:${this.config.password}`);
    const originData: {
      [key: string]: string;
    } = {
      'https://dav.jianguoyun.com': 'https://dav.jianguoyun.com/dav',
    };
    this.request = extend({
      prefix: originData[this.config.origin] ?? this.config.origin,
      headers: {
        Authorization: `Basic ${this.auth}`,
      },
    });
  }

  getId = () => {
    return this.auth;
  };

  getUserInfo = async () => {
    return {
      name: 'WebDAV',
      avatar: '',
      description: this.config.username,
    };
  };

  getRepositories = async (): Promise<Repository[]> => {
    const result = await this.getChildrenList();
    return result.map(o => ({
      id: o.href,
      name: o.displayname,
      groupId: 'Root',
      groupName: 'Root',
    }));
  };

  getChildrenList = async (parent = '/'): Promise<{ displayname: string; href: string }[]> => {
    const result = await this.request(parent, {
      method: 'PROPFIND',
    });
    const folder = new DOMParser().parseFromString(result, 'text/xml');
    const list = Array.from(folder.getElementsByTagName('d:response')).map(file => {
      const href = file.getElementsByTagName('d:href')[0];
      const displayname = file.getElementsByTagName('d:displayname')[0];
      return {
        href: href.textContent!,
        displayname: displayname.textContent!,
      };
    });

    const root = list.shift();
    return list.map(o => ({
      ...o,
      href: o.href?.replace(root!.href!, '/'),
    }));
  };

  createDocument = async (info: CreateDocumentRequest): Promise<void> => {
    await this.request.put<{ errmsg: string; errno: number }>(
      `${info.repositoryId}${info.title}.md`,
      {
        data: info.content,
      }
    );
    return;
  };
}
