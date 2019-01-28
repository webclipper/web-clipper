// import { Router } from 'react-router';

interface GlobalStore {
  userInfo: UserInfoStore;
  clipper: ClipperStore;
  completePage: CompletePageStore;
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
