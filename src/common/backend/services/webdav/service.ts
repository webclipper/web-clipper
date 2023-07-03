import { WebDAVServiceConfig } from './interface';
import { DocumentService, CreateDocumentRequest, Repository } from './../interface';
import { FileStat, WebDAVClient, createClient } from 'webdav/web';

export default class WebDAVDocumentService implements DocumentService {
  private auth: string;
  private client: WebDAVClient;

  constructor(private config: WebDAVServiceConfig) {
    this.auth = btoa(`${this.config.username}:${this.config.password}`);
    const originData: {
      [key: string]: string;
    } = {
      'https://dav.jianguoyun.com': 'https://dav.jianguoyun.com/dav',
    };
    const entryPoint = originData[this.config.origin] ?? this.config.origin;
    this.client = createClient(entryPoint, {
      username: this.config.username,
      password: this.config.password,
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
    const list = await this.client.getDirectoryContents(parent).then(files =>
      (files as FileStat[]).map(file => ({
        href: file.filename,
        displayname: file.basename,
      }))
    );
    console.log({ list });

    return list;
  };

  createDocument = async (info: CreateDocumentRequest): Promise<void> => {
    await this.client.putFileContents(
      `${info.repositoryId}/${info.title.replace(/[\\/]/g, '_')}.md`,
      info.content
    );
    return;
  };
}
