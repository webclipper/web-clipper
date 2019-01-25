interface GlobalStore {
  userInfo: UserInfoStore;
  clipper: ClipperStore;
  completePage: CompletePageStore;
  userPreference: UserPreferenceStore;
}

interface UserInfoStore {
  name?: string;
  avatar?: string;
  homePage?: string;
  form?: any;
}

interface ClipperStore {
  /** 文章标题 */
  title?: string;
  repositories: Repository[];
  currentRepository?: Repository;
  selectRepository: {
    createMode: boolean;
    repositoryTitle: string;
    creating: boolean;
  };
}

interface CompletePageStore {
  /** 裁剪成功后的文章地址 */
  documentAddress?: string;
}
interface UserPreferenceStore {
  closeQRCode: boolean;
  accessToken?: string;
  defaultRepositoryId?: string;
  defaultClipperType?: string;
  haveImageService: boolean;
  initializeForm: InitializeForm;
}

interface InitializeForm {
  token?: any;
  host?: any;
  defaultRepository?: any;
}
