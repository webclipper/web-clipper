import { IWebRequestService, RequestInBackgroundOptions } from '@/service/common/webRequest';
import { Container } from 'typedi';
import {
  WizNoteUserInfo,
  WizNoteConfig,
  WizNoteGetTagsResponse,
  WizNoteCreateTagResponse,
  WizNoteGetRepositoriesResponse,
  WizNoteCreateDocumentRequest,
} from '@/common/backend/services/wiznote/interface';
import md5 from '@web-clipper/shared/lib/md5';
import { DocumentService } from '@/common/backend/index';
import { Repository, CompleteStatus } from '../interface';

export default class WizNoteDocumentService implements DocumentService {
  private config: WizNoteConfig;
  private webRequestService: IWebRequestService;
  private userInfo?: WizNoteUserInfo['result'];

  constructor(config: WizNoteConfig) {
    this.config = config;
    this.webRequestService = Container.get(IWebRequestService);
  }

  getId = () => {
    return md5(`${this.config.origin}`);
  };

  getUserInfo = async () => {
    if (!this.userInfo) {
      const response = await this.request<WizNoteUserInfo>(
        '/as/user/login/auto?clientType=web&clientVersion=4.0&lang=zh-cn'
      );
      this.userInfo = response.result;
    }
    return {
      name: this.userInfo.displayName,
      avatar: `${this.config.origin}/as/user/avatar/${this.userInfo.userGuid}?avatarVersion=1`,
      homePage: '',
      description: this.userInfo.email,
    };
  };

  getRepositories = async (): Promise<Repository[]> => {
    await this.getUserInfo();

    const response = await this.request<WizNoteGetRepositoriesResponse>(
      `/ks/category/all/${this.userInfo!.kbGuid}`
    );

    return response.result
      .sort((a, b) => a.localeCompare(b))
      .map(o => {
        return {
          id: o,
          name: o,
          groupId: '为知笔记',
          groupName: '为知笔记',
        };
      });
  };

  getTags = async () => {
    const response = await this.request<WizNoteGetTagsResponse>(
      `/ks/tag/all/${this.userInfo?.kbGuid}?clientType=web&clientVersion=4.0&lang=zh-cn`
    );
    return response.result;
  };

  createTag = async (name: string) => {
    const response = await this.request<WizNoteCreateTagResponse>(
      `/ks/tag/create/${this.userInfo?.kbGuid}?clientType=web&clientVersion=4.0&lang=zh-cn`,
      {
        method: 'post',
        data: {
          parentTagGuid: null,
          name,
        },
      }
    );
    return response.result.tagGuid;
  };

  createDocument = async (req: WizNoteCreateDocumentRequest): Promise<CompleteStatus> => {
    const existTags = await this.getTags();
    const tags = await Promise.all(
      req.tags.map(async tag => {
        const exist = existTags.find(o => o.name === tag);
        if (exist) {
          return exist.tagGuid;
        }
        return this.createTag(tag);
      })
    );

    const html = `<pre>${req.content}</pre>`;
    const response = await this.request<{
      result: {
        docGuid: string;
      };
    }>(`/ks/note/create/${this.userInfo?.kbGuid}?clientType=web&clientVersion=4.0&lang=zh-cn`, {
      method: 'post',
      data: {
        kbGuid: this.userInfo?.kbGuid,
        html: `<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style id="wiz_custom_css">html, body {font-size: 12pt;}body {font-family: Helvetica, "Hiragino Sans GB", "微软雅黑", "Microsoft YaHei UI", SimSun, SimHei, arial, sans-serif;line-height: 1.6;margin: 0 auto;padding: 20px 16px;padding: 1.25rem 1rem;}h1, h2, h3, h4, h5, h6 {margin:20px 0 10px;margin:1.25rem 0 0.625rem;padding: 0;font-weight: bold;}h1 {font-size:20pt;font-size:1.67rem;}h2 {font-size:18pt;font-size:1.5rem;}h3 {font-size:15pt;font-size:1.25rem;}h4 {font-size:14pt;font-size:1.17rem;}h5 {font-size:12pt;font-size:1rem;}h6 {font-size:12pt;font-size:1rem;color: #777777;margin: 1rem 0;}div, p, ul, ol, dl, li {margin:0;}blockquote, table, pre, code {margin:8px 0;}ul, ol {padding-left:32px;padding-left:2rem;}ol.wiz-list-level1 > li {list-style-type:decimal;}ol.wiz-list-level2 > li {list-style-type:lower-latin;}ol.wiz-list-level3 > li {list-style-type:lower-roman;}blockquote {padding:0 12px;padding:0 0.75rem;}blockquote > :first-child {margin-top:0;}blockquote > :last-child {margin-bottom:0;}img {border:0;max-width:100%;height:auto !important;margin:2px 0;}table {border-collapse:collapse;border:1px solid #bbbbbb;}td, th {padding:4px 8px;border-collapse:collapse;border:1px solid #bbbbbb;height:28px;word-break:break-all;box-sizing: border-box;}.wiz-hide {display:none !important;}</style></head><body>${html}</body></html>`,
        category: req.repositoryId,
        owner: this.userInfo?.email,
        tags: tags.join('*'),
        title: `${req.title}.md`,
        params: null,
        appInfo: null,
      },
    });
    return {
      href: `${this.config.origin}/wapp/folder/${this.userInfo!.kbGuid}?c=${encodeURIComponent(
        req.repositoryId
      )}&docGuid=${response.result.docGuid}`,
    };
  };
  private request<T>(
    url: string,
    options?: Omit<RequestInBackgroundOptions, 'headers' | 'prefix'>
  ) {
    return this.webRequestService.requestInBackground<T>(url, {
      prefix: this.config.origin,
      headers: {
        'X-Wiz-Referer': this.config.origin,
        'X-Wiz-Token': this.userInfo?.token ?? '',
      },
      ...options,
    });
  }
}
