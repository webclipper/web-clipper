import { ClipperDataType } from '@/common/modelTypes/userPreference';
import { Repository, CompleteStatus } from '@/common/backend/services/interface';

export interface ClipperStore {
  /** 网页标题 */
  title?: string;
  /** 网页链接 */
  url?: string;
  /** 当前选择账户的ID */
  currentAccountId: string;
  /** 是否在加载知识库列表 */
  loadingRepositories: boolean;
  /** 知识库列表 */
  repositories: Repository[];
  /** 当前图床 */
  currentImageHostingService?: { type: string };
  /** 当前选择的知识库 */
  currentRepository?: Repository;
  clipperData: {
    [key: string]: ClipperDataType;
  };
  /** 是否正在创建文档 */
  creatingDocument: boolean;
  completeStatus?: CompleteStatus;
}
