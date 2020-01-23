import md5 from '@web-clipper/shared/lib/md5';
import {
  ConfluenceServiceConfig,
  ConfluenceUserInfo,
  ConfluenceListResult,
  ConfluencePage,
  ConfluenceSpaceContent,
} from '@/common/backend/services/confluence/interface';
import { DocumentService } from '../../index';
import { extend, RequestMethod } from 'umi-request';
import { Repository, CreateDocumentRequest, CompleteStatus } from '../interface';
import showdown from 'showdown';

const converter = new showdown.Converter();

export default class GithubDocumentService implements DocumentService {
  private config: ConfluenceServiceConfig;
  private request: RequestMethod;

  constructor(config: ConfluenceServiceConfig) {
    this.config = config;
    this.request = extend({
      prefix: `${this.config.origin}/rest/api/`,
    });
  }

  getId = () => {
    return md5(`${this.config.origin}:${this.config.spaceId}`);
  };

  getUserInfo = async () => {
    const response = await this.request.get<ConfluenceUserInfo>('user/current');
    return {
      name: response.displayName,
      avatar: `${this.config.origin}${response.profilePicture.path}`,
      homePage: '',
      description: 'Confluence user',
    };
  };

  getRepositories = async (): Promise<Repository[]> => {
    const confluenceSpaceContent = await this.request.get<ConfluenceSpaceContent>(
      `content/${this.config.spaceId}`
    );
    const response = await this.request.get<ConfluenceListResult<ConfluencePage>>(
      `content/${this.config.spaceId}/child/page`
    );
    return response.results.map(({ id, title }) => ({
      id: id,
      name: title,
      groupId: confluenceSpaceContent.space.key,
      groupName: confluenceSpaceContent.space.name,
    }));
  };

  createDocument = async (req: CreateDocumentRequest): Promise<CompleteStatus> => {
    const confluenceSpaceContent = await this.request.get<ConfluenceSpaceContent>(
      `content/${this.config.spaceId}`
    );
    const response = await this.request.post<{
      _links: {
        webui: string;
      };
    }>('content', {
      data: {
        type: 'page',
        title: req.title,
        ancestors: [{ id: req.repositoryId }],
        space: { key: confluenceSpaceContent.space.key },
        body: { storage: { value: converter.makeHtml(req.content), representation: 'storage' } },
      },
    });
    return {
      href: `${this.config.origin}${response._links.webui}`,
    };
  };
}
