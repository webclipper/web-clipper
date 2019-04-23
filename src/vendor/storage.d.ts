interface GlobalStore {
  clipper: ClipperStore;
  userPreference: UserPreferenceStore;
  router: {
    location: {
      pathname: string;
      search: string;
    };
  };
}

interface Repository {
  id: string;
  name: string;
  private: boolean;
  createdAt: string;
  owner: string;
  /**
   * namespace = owner/name
   */
  namespace: string;
}

interface ImageClipperData {
  dataUrl: string;
  width: number;
  height: number;
}

type ClipperDataType = string | ImageClipperData;

interface ClipperStore {
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

interface CompleteStatus {
  /** 裁剪成功后的文章地址 */
  documentHref: string;
  documentId: string;
  repositoryId: string;
}

interface ImageHosting {
  id: string;
  type: string;
  remark?: string;
  info?: {
    [key: string]: string;
  };
}

interface UserPreferenceStore {
  accounts: AccountPreference[];
  imageHosting: ImageHosting[];
  defaultPluginId?: string | null;
  defaultAccountId?: string;
  showQuickResponseCode: boolean;
  showLineNumber: boolean;
  liveRendering: boolean;
  initializeForm: {
    repositories: Repository[];
    userInfo?: {
      name: string;
      avatar: string;
      homePage: string;
      description?: string;
    };
    verifying: boolean;
    verified: boolean;
  };
  servicesMeta: {
    [type: string]: any;
  };
  imageHostingServicesMeta: {
    [type: string]: any;
  };
  extensions: any[];
}

interface FormProps {
  value: string;
}

interface AccountPreference {
  id: string;
  type: string;
  name: string;
  avatar: string;
  homePage: string;
  description?: string;
  defaultRepositoryId?: string;
  imageHosting?: string;
  [key: string]: string | undefined;
}

interface PreferenceStorage {
  accounts: AccountPreference[];
  imageHosting: ImageHosting[];
  defaultPluginId?: string | null;
  defaultAccountId?: string;
  showQuickResponseCode: boolean;
  showLineNumber: boolean;
  liveRendering: boolean;
}
