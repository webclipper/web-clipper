declare module '*';

interface CounterStore {
  count: number;
}

interface UserInfoStore {
  name?: string;
  avatar?: string;
  homePage?: string;
}

interface Repository {
  id: string;
  name: string;
}

interface ClipperStore {
  /** 文章标题 */
  title?: string;
  repositories?: Repository[];
  currentRepository?: Repository;
}

interface CompletePageStore {
  /** 裁剪成功后的文章地址 */
  documentAddress?: string;
}
interface UserPreferenceStore {
  closeQRCode: boolean;
  token: string;
  baseURL: string;
  defaultRepositoryId: string;
  defaultClipperType: string;
}

interface GlobalStore {
  counter: CounterStore;
  userInfo: UserInfoStore;
  clipper: ClipperStore;
  completePage: CompletePageStore;
  userPreference: UserPreferenceStore;
}

interface ClipperPlugin {
  id: number;
  name: string;
  icon: string;
  description: string;
  script: string;
  type: 'clipper';
}
