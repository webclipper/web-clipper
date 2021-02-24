import { IBasicRequestService } from '@/service/common/request';
import { CompleteStatus } from 'common/backend/interface';
import Container from 'typedi';
import { DocumentService, CreateDocumentRequest } from '../../index';
import showdown from 'showdown';
import { ICookieService } from '@/service/common/cookie';
import locale from '@/common/locales';

export default class GithubDocumentService implements DocumentService {
  getId = () => {
    return 'Flomo';
  };

  getUserInfo = async () => {
    return {
      name: 'Flomo',
      avatar: '',
      homePage: 'https://flomoapp.com/',
      description: 'Flomo',
    };
  };

  getRepositories = async () => {
    /**
     * Check Login
     */
    await this.getXSRFToken();
    return [
      {
        id: 'flomo',
        name: 'Flomo',
        groupId: 'flomo',
        groupName: 'Flomo',
      },
    ];
  };

  createDocument = async (info: CreateDocumentRequest): Promise<CompleteStatus> => {
    const request = Container.get(IBasicRequestService);
    const converter = new showdown.Converter({});
    converter.addExtension({
      type: 'html',
      filter: (html: string) => {
        return html.replace(/<img src="(.+?)"(.*)\/>/g, '<p>$1</p>');
      },
    });
    const XSRFToken = await this.getXSRFToken();
    const res = await request.request<{ code: number; message: string }>(
      'https://flomoapp.com/api/memo/',
      {
        method: 'put',
        requestType: 'json',
        headers: {
          'x-requested-with': 'XMLHttpRequest',
          'x-xsrf-token': decodeURIComponent(XSRFToken),
        },
        data: {
          source: 'web',
          parent_memo_slug: null,
          content: converter.makeHtml(info.content),
          file_ids: [],
        },
      }
    );
    if (res.code !== 0) {
      throw new Error(res.message);
    }
    return {
      href: `https://flomoapp.com/mine`,
    };
  };

  private async getXSRFToken(): Promise<string> {
    const cookies = await Container.get(ICookieService).get({
      name: 'XSRF-TOKEN',
      url: 'https://flomoapp.com/',
    });
    if (!cookies) {
      throw new Error(
        locale.format({
          id: 'backend.services.flomo.login',
        })
      );
    }
    return cookies.value;
  }
}
