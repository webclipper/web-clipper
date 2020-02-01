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

interface TickTickProfile {
  name: string;
  username: string;
  picture: string;
}

interface TickTickCheckResponse {
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
interface TickTickCreateDocumentRequest extends CreateDocumentRequest {
  tags: string[];
}

export default class TickTickDocumentService implements DocumentService {
  private request: RequestMethod;

  constructor() {
    const request = extend({
      prefix: `https://api.ticktick.com/api/v2/`,
    });
    request.interceptors.response.use(
      response => {
        if (response.clone().status === 401) {
          throw new UnauthorizedError(
            localeService.format({
              id: 'backend.services.ticktick.unauthorizedErrorMessage',
              defaultMessage: 'Unauthorized! Please Login TickTick Web.',
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
    return 'TickTick';
  };

  getUserInfo = async () => {
    const response = await this.request.get<TickTickProfile>('user/profile');
    return {
      name: response.name,
      avatar: response.picture,
      homePage: '',
      description: response.username,
    };
  };

  getTags = async (): Promise<string[]> => {
    const TickTickCheckResponse = await this.request.get<TickTickCheckResponse>(`batch/check/0`);
    return TickTickCheckResponse.tags.map(o => o.name);
  };

  getRepositories = async (): Promise<Repository[]> => {
    const TickTickCheckResponse = await this.request.get<TickTickCheckResponse>(`batch/check/0`);
    const groupMap = new Map<string, string>();
    TickTickCheckResponse.projectGroups.forEach(group => {
      groupMap.set(group.id, group.name);
    });
    return TickTickCheckResponse.projectProfiles
      .filter(o => !o.closed)
      .map(({ id, name, groupId }) => ({
        id: id,
        name: name,
        groupId: groupId
          ? groupId
          : localeService.format({
              id: 'backend.services.ticktick.rootGroup',
              defaultMessage: 'Root',
            }),
        groupName: groupId
          ? groupMap.get(groupId)!
          : localeService.format({
              id: 'backend.services.ticktick.rootGroup',
              defaultMessage: 'Root',
            }),
      }));
  };

  createDocument = async (request: TickTickCreateDocumentRequest): Promise<CompleteStatus> => {
    const webRequestService = Container.get(IWebRequestService);

    const header = await webRequestService.startChangeHeader({
      urls: ['https://api.ticktick.com/*'],
      requestHeaders: [
        {
          name: 'origin',
          value: 'https://ticktick.com',
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
      href: `https://ticktick.com/#p/${request.repositoryId}/tasks/${id}`,
    };
  };
}
