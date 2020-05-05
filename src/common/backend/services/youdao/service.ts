import { CompleteStatus, UnauthorizedError } from './../interface';
import { DocumentService, Repository, CreateDocumentRequest } from '../../index';
import axios, { AxiosInstance } from 'axios';
import { stringify } from 'qs';
import { generateUuid } from '@web-clipper/shared/lib/uuid';
import localeService from '@/common/locales';
import Container from 'typedi';
import { ICookieService } from '@/service/common/cookie';

interface YouDaoRepository {
  fileEntry: {
    id: string;
    name: string;
    parentId: string;
  };
}

export default class YoudaoDocumentService implements DocumentService {
  private request: AxiosInstance;

  constructor() {
    const request = axios.create({
      baseURL: 'https://note.youdao.com',
      timeout: 10000,
      transformResponse: [
        (data): any => {
          return JSON.parse(data);
        },
      ],
      withCredentials: true,
    });
    this.request = request;
    this.request.interceptors.response.use(
      r => r,
      error => {
        if (error.response) {
          const { response } = error;
          if (response.status === 500 && response.data && response.data.error === '207') {
            return Promise.reject(
              new UnauthorizedError(
                localeService.format({
                  id: 'backend.services.youdao.unauthorizedErrorMessage',
                  defaultMessage: 'Unauthorized! Please Login Youdao Web.',
                })
              )
            );
          }
        }
        return Promise.reject(error);
      }
    );
  }

  getId = () => {
    return 'youdao';
  };

  getRepositories = async () => {
    const cstk = await this.getCSTK();
    let formData = new FormData();
    formData.append('path', '/');
    formData.append('dirOnly', 'true');
    formData.append('f', 'true');
    formData.append('cstk', cstk);
    const response = await this.request.post<YouDaoRepository[]>(
      `/yws/api/personal/file?${stringify({
        method: 'listEntireByParentPath',
        keyfrom: 'web',
        cstk,
      })}`,
      formData
    );
    return response.data.map(
      ({ fileEntry: { parentId, name, id } }): Repository => ({
        id,
        name,
        groupId: parentId,
        groupName: localeService.format({
          id: 'backend.services.youdao.myFolders',
          defaultMessage: 'My Folders',
        }),
      })
    );
  };

  createDocument = async ({
    repositoryId,
    title,
    content,
  }: CreateDocumentRequest): Promise<CompleteStatus> => {
    const cstk = await this.getCSTK();
    let formData = new FormData();
    let uuid = generateUuid().replace(/-/g, '');
    let fileId = `WEB${uuid}`;
    const timestamp = String(Math.floor(Date.now() / 1000));
    formData.append('fileId', fileId);
    formData.append('parentId', repositoryId);
    formData.append('name', `${title}.md`);
    formData.append('domain', `1`);
    formData.append('rootVersion', `-1`);
    formData.append('dir', `false`);
    formData.append('sessionId', '');
    formData.append('createTime', timestamp);
    formData.append('modifyTime', timestamp);
    formData.append('transactionId', fileId);
    formData.append('bodyString', content);
    formData.append('transactionTime', timestamp);
    formData.append('cstk', cstk);
    try {
      await this.request.post(
        `/yws/api/personal/sync?${stringify({
          method: 'push',
          keyfrom: 'web',
          cstk,
        })}`,
        formData
      );
    } catch (_error) {
      uuid = generateUuid().replace(/-/g, '');
      fileId = `WEB${uuid}`;
      formData.set('fileId', fileId);
      formData.set('transactionId', fileId);
      formData.set('name', `${title}-${uuid}.md`);
      await this.request.post(
        `/yws/api/personal/sync?${stringify({
          method: 'push',
          keyfrom: 'web',
          cstk,
        })}`,
        formData
      );
    }
    return {
      href: `https://note.youdao.com/web/#/file/recent/markdown/${fileId}`,
    };
  };

  getUserInfo = async () => {
    const cstk = await this.getCSTK();
    const response = await this.request.get<{ name: string; photo: string }>(
      `/yws/api/self?${stringify({
        method: 'get',
        keyfrom: 'web',
        cstk,
      })}`
    );
    const { data } = response;
    return {
      name: data.name,
      avatar: `https://note.youdao.com${data.photo}`,
      homePage: 'https://note.youdao.com/web',
    };
  };

  private getCSTK = async () => {
    const cookie = await Container.get(ICookieService).get({
      url: 'https://note.youdao.com',
      name: 'YNOTE_CSTK',
    });
    if (!cookie) {
      throw new UnauthorizedError(
        localeService.format({
          id: 'backend.services.youdao.unauthorizedErrorMessage',
          defaultMessage: 'Unauthorized! Please Login Youdao Web.',
        })
      );
    }
    return cookie.value;
  };
}
