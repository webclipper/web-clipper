interface GlobalStore {
  userInfo: UserInfoStore;
  clipper: ClipperStore;
  userPreference: UserPreferenceStore;
  router: {
    location: {
      pathname: string;
    };
  };
}

interface UserInfoStore {
  name?: string;
  avatar?: string;
  homePage?: string;
}

interface TextClipperData extends BaseClipperType {
  type: 'text';
  data: string;
}

interface BaseClipperType {
  type: string;
}

type ClipperDataType = TextClipperData;

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
  /** 当前选择的知识库 */
  currentRepository?: Repository;
  clipperData: {
    [key: string]: ClipperDataType;
  };
  /** 是否正在创建文档 */
  creatingDocument: boolean;
  completeStatus?: CompleteStatus;
  selectRepository: {
    createMode: boolean;
    repositoryTitle: string;
    creating: boolean;
  };
}

interface CompleteStatus {
  /** 裁剪成功后的文章地址 */
  documentHref?: string;
}
interface UserPreferenceStore {
  accounts: AccountPreference[];
  defaultPluginId?: string | null;
  defaultAccountId?: string;
  showQuickResponseCode: boolean;
  showLineNumber: boolean;
  liveRendering: boolean;
  initializeForm: InitializeForm;
}

interface FormProps {
  value: string;
}

interface InitializeForm {
  type: FormProps;
  host?: FormProps;
  accessToken?: FormProps;
  defaultRepositoryId?: FormProps;
  verifying: boolean;
  show: boolean;
  verified: boolean;
  repositories: Repository[];
  userInfo: {
    name: string;
    avatar?: string;
    homePage?: string;
    description?: string;
  };
}

interface AccountPreference {
  type: string;
  id: string;
  accessToken: string;
  host: string;
  defaultRepositoryId?: string;
  name: string;
  avatar?: string;
  homePage?: string;
  description?: string;
}

interface PreferenceStorage {
  accounts: AccountPreference[];
  defaultPluginId?: string | null;
  defaultAccountId?: string;
  showQuickResponseCode: boolean;
  showLineNumber: boolean;
  liveRendering: boolean;
}
