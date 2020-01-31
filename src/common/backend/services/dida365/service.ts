import { generateUuid } from '@web-clipper/shared/lib/uuid';
import { CreateDocumentRequest, CompleteStatus } from './../interface';
import { DocumentService } from '../../index';
import { extend, RequestMethod } from 'umi-request';
import { Repository } from '../interface';

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

export default class Dida365DocumentService implements DocumentService {
  private request: RequestMethod;

  constructor() {
    this.request = extend({
      prefix: `https://api.dida365.com/api/v2/`,
    });
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
        groupId: groupId ? groupId : 'Root',
        groupName: groupId ? groupMap.get(groupId)! : 'Root',
      }));
  };

  createDocument = async (request: CreateDocumentRequest): Promise<CompleteStatus> => {
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
          tags: [],
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

    const handler = (request: chrome.webRequest.WebRequestHeadersDetails) => {
      const headers = (request.requestHeaders ?? [])
        .filter(header => {
          return header.name !== 'Origin';
        })
        .concat([
          {
            name: 'origin',
            value: 'https://dida365.com',
          },
        ]);
      return {
        requestHeaders: headers,
      };
    };
    chrome.webRequest.onBeforeSendHeaders.addListener(
      handler,
      { urls: ['https://api.dida365.com/api/v2/batch/task'] },
      ['blocking', 'requestHeaders', 'extraHeaders']
    );

    await this.request.post('batch/task', {
      data: data,
    });

    chrome.webRequest.onBeforeSendHeaders.removeListener(handler);
    chrome.webRequest.handlerBehaviorChanged();

    return {
      href: `https://dida365.com/#p/${request.repositoryId}/tasks/${id}`,
    };
  };
}
