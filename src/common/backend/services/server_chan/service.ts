import localeService from '@/common/locales';
import { CompleteStatus } from 'common/backend/interface';
import { DocumentService, CreateDocumentRequest } from '../../index';
import request from 'umi-request';

export default class GithubDocumentService implements DocumentService {
  private config: { accessToken: string };

  constructor(config: { accessToken: string }) {
    this.config = config;
  }

  getId = () => {
    return this.config.accessToken;
  };

  getUserInfo = async () => {
    return {
      name: localeService.format({
        id: 'backend.services.server_chan.name',
      }),
      avatar: '',
      homePage: 'https://sc.ftqq.com/',
      description: localeService.format({
        id: 'backend.services.server_chan.name',
      }),
    };
  };

  getRepositories = async () => {
    return [
      {
        id: 'server_chan',
        name: localeService.format({
          id: 'backend.services.server_chan.name',
        }),
        groupId: 'server_chan',
        groupName: localeService.format({
          id: 'backend.services.server_chan.name',
        }),
      },
    ];
  };

  createDocument = async (info: CreateDocumentRequest): Promise<CompleteStatus> => {
    const res = await request.post<{ errmsg: string; errno: number }>(
      `https://sc.ftqq.com/${this.config.accessToken}.send`,
      {
        requestType: 'form',
        data: {
          text: info.title,
          desp: info.content,
        },
      }
    );
    if (res.errno !== 0) {
      throw new Error(res.errmsg);
    }
    return {
      href: `http://sc.ftqq.com/`,
    };
  };
}
