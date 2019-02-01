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
  /** 知识库列表 */
  repositories: Repository[];
  /** 当前选择的知识库 */
  currentRepository?: Repository;
  clipperData: {
    [key: string]: ClipperDataType;
  };
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
  closeQRCode: boolean;
  accessToken?: string;
  baseHost?: string;
  defaultRepositoryId?: string;
  defaultClipperType?: string;
  haveImageService: boolean;
  initializeForm: InitializeForm;
}

interface InitializeForm {
  uploading: boolean;
  token?: any;
  host?: any;
}
