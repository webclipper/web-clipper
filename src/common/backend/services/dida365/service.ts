import { Container } from 'typedi';
import { generateUuid } from '@web-clipper/shared/lib/uuid';
import localeService from '@/common/locales';
import { IWebRequestService } from '@/service/common/webRequest';
import {
  CreateDocumentRequest,
  CompleteStatus,
  UnauthorizedError,
  Repository,
} from '@/common/backend/services/interface';
import { DocumentService } from '@/common/backend/index';
import { extend, RequestMethod } from 'umi-request';

interface Dida365Profile {
  name: string;
  username: string;
  picture: string;
}

interface Dida365CheckResponse {
  projectProfiles: {
    id: string;
    name: string;
    isOwner: boolean;
    closed: boolean;
    groupId: string;
  }[];
  projectGroups: {
    id: string;
    name: string;
  }[];
  tags: {
    name: string;
  }[];
}
interface Dida365CreateDocumentRequest extends CreateDocumentRequest {
  tags: string[];
}

export default class Dida365DocumentService implements DocumentService {
  private request: RequestMethod;

  constructor() {
    const request = extend({
      prefix: `https://api.dida365.com/api/v2/`,
    });
    request.interceptors.response.use(
      response => {
        if (response.clone().status === 401) {
          throw new UnauthorizedError(
            localeService.format({
              id: 'backend.services.dida365.unauthorizedErrorMessage',
              defaultMessage: 'Unauthorized! Please Login Dida365 Web.',
            })
          );
        }
        return response;
      },
      { global: false }
    );

    this.request = request;
  }

  getId = () => {
    return 'dida365';
  };

  getUserInfo = async () => {
    const response = await this.request.get<Dida365Profile>('user/profile');
    return {
      name: response.name,
      avatar: response.picture,
      homePage: '',
      description: response.username,
    };
  };

  getTags = async (): Promise<string[]> => {
    const dida365CheckResponse = await this.request.get<Dida365CheckResponse>(`batch/check/0`);
    return dida365CheckResponse.tags.map(o => o.name);
  };

  getRepositories = async (): Promise<Repository[]> => {
    const dida365CheckResponse = await this.request.get<Dida365CheckResponse>(`batch/check/0`);
    const groupMap = new Map<string, string>();
    dida365CheckResponse.projectGroups.forEach(group => {
      groupMap.set(group.id, group.name);
    });
    return dida365CheckResponse.projectProfiles
      .filter(o => !o.closed)
      .map(({ id, name, groupId }) => ({
        id: id,
        name: name,
        groupId: groupId
          ? groupId
          : localeService.format({
              id: 'backend.services.dida365.rootGroup',
              defaultMessage: 'Root',
            }),
        groupName: groupId
          ? groupMap.get(groupId)!
          : localeService.format({
              id: 'backend.services.dida365.rootGroup',
              defaultMessage: 'Root',
            }),
      }));
  };

  createDocument = async (request: Dida365CreateDocumentRequest): Promise<CompleteStatus> => {
    const webRequestService = Container.get(IWebRequestService);

    const header = await webRequestService.startChangeHeader({
      urls: ['https://api.dida365.com/*'],
      requestHeaders: [
        {
          name: 'origin',
          value: 'https://dida365.com',
        },
      ],
    });

    const settings = await this.request.get<{ timeZone: string }>(
      'user/preferences/settings?includeWeb=true'
    );

    const id = generateUuid()
      .replace(/-/g, '')
      .slice(0, 24);
    const data = {
      add: [
        {
          items: [],
          reminders: [],
          exDate: [],
          dueDate: null,
          priority: 0,
          progress: 0,
          assignee: null,
          sortOrder: -4611733297427382000,
          startDate: null,
          isFloating: false,
          status: 0,
          deleted: 0,
          tags: request.tags,
          projectId: request.repositoryId,
          title: request.title,
          content: request.content,
          timeZone: settings.timeZone,
          id: id,
        },
      ],
      update: [],
      delete: [],
    };

    await this.request.post('batch/task', {
      data: data,
      headers: {
        [header.name]: header.value,
      },
    });

    await webRequestService.end(header);

    return {
      href: `https://dida365.com/#p/${request.repositoryId}/tasks/${id}`,
    };
  };
}
