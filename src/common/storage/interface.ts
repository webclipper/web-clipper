import { AccountPreference, ImageHosting } from 'common/types';
export interface PreferenceStorage {
  accounts: AccountPreference[];
  imageHosting: ImageHosting[];
  defaultPluginId?: string | null;
  defaultAccountId?: string;
  showLineNumber: boolean;
  liveRendering: boolean;
}

export interface CommonStorage {
  set(key: string, value: any): void | Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
}

export interface TypedCommonStorageInterface {
  getPreference(): Promise<PreferenceStorage>;

  /** --------账户相关--------- */

  setAccount(accounts: AccountPreference[]): Promise<void>;

  addAccount(account: AccountPreference): Promise<void>;

  deleteAccountById(accessToken: string): Promise<void>;

  getAccounts(): Promise<AccountPreference[]>;

  setDefaultAccountId(accountId: string): Promise<void>;

  getDefaultAccountId(): Promise<string | undefined>;

  /** --------默认插件--------- */

  setDefaultPluginId(id: string | null): Promise<void>;

  getDefaultPluginId(): Promise<string | undefined | null>;

  /** --------编辑器显示行号--------- */

  setShowLineNumber(value: boolean): Promise<void>;

  getShowLineNumber(): Promise<boolean>;

  /** --------实时渲染--------- */
  setLiveRendering(value: boolean): Promise<void>;

  getLiveRendering(): Promise<boolean>;

  /** --------图床--------- */

  addImageHosting(imageHosting: ImageHosting): Promise<ImageHosting[]>;

  getImageHosting(): Promise<ImageHosting[]>;

  deleteImageHostingById(id: string): Promise<ImageHosting[]>;

  editImageHostingById(id: string, value: ImageHosting): Promise<ImageHosting[]>;
}
