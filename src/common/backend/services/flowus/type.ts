import { Repository } from '../interface';

interface Space {
  uuid: string;
  title: string;
  subNodes: string[];
  permissionGroups?: any[];
}
interface SpaceView {
  uuid: string;
  spaceId: string;
  title: string;
}
type BlockType = number;
export interface Block {
  uuid: string;
  spaceId: string;
  parentId: string;
  type: BlockType;
  title: string;
  subNodes: string[];
  permissions: {
    type: string;
    role?: keyof typeof ROLE_WEIGHT;
    userId?: string;
    groupId?: string;
  }[];
}
export interface FlowUsSpace {
  spaces: Record<string, Space>;
  spaceViews: Record<string, SpaceView>;
}
export interface OSSInfo {
  ossName: string;
}
export interface FlowUsToc {
  data: {
    blocks?: Record<string, Block>;
  };
}

export interface FlowUsUserInfo {
  uuid: string;
  phone: string;
  nickname: string;
  backgroundColor: string;
  spaceViews: string;
  avatar?: string;
  ext?: {
    email?: {
      id: string;
      email: string;
    };
  };
}

export interface FlowUsRepository extends Repository {}

export interface TaskResult {
  results: Record<
    string,
    {
      taskId: string;
      eventName: string;
      status: string;
      result?: {
        status?: string;
        url?: string;
        size?: number;
        ossName?: string;
        uuid?: string;
        msg?: string;
      };
    }
  >;
}

export interface FlowUsResponse<DATA> {
  msg: string;
  code: number;
  data: DATA;
}

export const ROLE_WEIGHT = {
  none: 0,
  reader: 1,
  writer: 2,
  editor: 3,
  commenter: 4,
};

export interface Share {
  shared: boolean;
  title?: string;
  illegal: boolean;
  parentId?: string;
  isRestricted: boolean;
  /** 允许复制、打印、下载 */
  allowDuplicate: boolean;
  permissions: Block['permissions'];
  role: keyof typeof ROLE_WEIGHT;
  roleWithoutPublic: keyof typeof ROLE_WEIGHT;
}
