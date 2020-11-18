import { Repository } from '../interface';

export interface WolaiUserContent {
  code: number;
  message: string;
  data: {
    spaceViews: {
      [uuid: string]: {
        id: string;
        user_id: string;
        workspace_id: string;
        created_time: number;
        notify_desktop: boolean;
        notify_email: boolean;
        notify_mobile: boolean;
        favorite_pages: any[];
      };
    };
    workspaces: {
      id: string;
      created_by: string;
      created_time: number;
      domain: string;
      edited_by: string;
      edited_time: number;
      icon: string;
      members: number;
      name: string;
      pages: string[];
      plan_type: string;
      team_type: string;
    }[];
    blocks: {
      [uuid: string]: {
        id: string;
        active: boolean;
        attributes: {
          title?: string[][];
        };
        created_by: string;
        created_time: number;
        edited_by: string;
        edited_time: number;
        parent_id: string;
        parent_type: string;
        permissions: {
          type: string;
          role: string;
          user_id: string;
        }[];
        sub_nodes: string[];
        text_content: string;
        type: string;
        ver: number;
        workspace_id: string;
        setting: {};
      };
    };
  };
}

export interface WolaiUserInfo {
  code: number;
  data: {
    userId: string;
    mobile: string[];
    email: string;
    userName: string;
    avatar: string;
    userHash: string;
    recommendCode: string;
    registerTime: number;
    isNewUser: boolean;
    inviteRemainingCount: number;
    invitedUserCount: number;
  };
  message: string;
}

export interface WolaiRepository extends Repository {
  pageType: string;
  spaceId: string;
}
