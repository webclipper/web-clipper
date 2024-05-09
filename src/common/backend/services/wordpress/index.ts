import {
  CompleteStatus,
  CreateDocumentRequest,
  DocumentService,
  ServiceMeta,
} from '@/common/backend';
import localeService from '@/common/locales';
import form from './form';
import { encode } from 'js-base64';

export interface WordPressServiceConfig {
  host: string;
  username: string;
  pwd: string;
}

export interface WordpressCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WordpressUser {
  id: number;
  name: string;
  description: string;
  link: string;
}

export class WordPressDocumentService implements DocumentService {
  private config: WordPressServiceConfig;

  constructor(config: WordPressServiceConfig) {
    this.config = config;
  }

  getId = () => {
    return 'wordpress';
  };

  getToken = () => {
    return encode(`${this.config.username}:${this.config.pwd}`);
  };

  getRepositories = async () => {
    const res = await fetch(`${this.config.host}/wp-json/wp/v2/categories`, {
      credentials: 'omit',
      headers: {
        Authorization: `Basic ${this.getToken()}`,
      },
    });
    const data = ((await res.json()) as unknown) as WordpressCategory[];
    return data.map(item => {
      return {
        id: String(item.id),
        name: item.name,
        groupName: 'wordpress',
        groupId: 'wordpress',
      };
    });
  };

  createDocument = async (request: CreateDocumentRequest) => {
    const res = await fetch(`${this.config.host}/wp-json/wp/v2/posts`, {
      method: 'POST',
      credentials: 'omit',
      headers: {
        Authorization: `Basic ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'private',
        title: {
          raw: request.title,
          rendered: request.title,
        },
        content: {
          raw: request.content,
          rendered: request.content,
        },
        categories: [Number(request.repositoryId)],
      }),
    });
    const data = await res.json();
    return {
      href: data.link,
    } as CompleteStatus;
  };

  getUserInfo = async () => {
    console.log('getUserInfo:', this, this.config);
    const res = await fetch(`${this.config.host}/wp-json/wp/v2/users/me`, {
      credentials: 'omit',
      headers: {
        Authorization: `Basic ${this.getToken()}`,
      },
    });
    const user = ((await res.json()) as unknown) as WordpressUser;
    return {
      name: user.name,
      avatar: '',
      homePage: user.link,
      description: user.description,
    };
  };
}

export default (): ServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.services.wordpress.name',
      defaultMessage: 'WordPress',
    }),
    form,
    icon: 'wordpress',
    type: 'wordpress',
    service: WordPressDocumentService,
    permission: {},
  };
};
