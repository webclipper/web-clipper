interface CommonStorage {
  set(key: string, value: any): Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
}

export class ChromeSyncStorageImpl implements CommonStorage {
  public async set(key: string, item: Object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let tempObject: any = {};
      tempObject[key] = item;
      chrome.storage.sync.set(tempObject, () => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async get<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      chrome.storage.sync.get(key, (item: any) => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          const date = item[key];
          resolve(date);
        }
      });
    });
  }
}

export interface TypedCommonStorageInterface {
  getPreference(): Promise<PreferenceStorage>;

  /** --------账户相关--------- */

  addAccount(account: AccountPreference): Promise<void>;

  deleteAccountByAccessToken(accessToken: string): Promise<void>;

  getAccounts(): Promise<AccountPreference[]>;

  /** --------当前默认账户 ID--------- */

  setDefaultAccountId(accountId: string): Promise<void>;

  getDefaultAccountId(): Promise<string | undefined>;

  /** --------默认插件--------- */

  setDefaultPluginId(id: string): Promise<void>;

  getDefaultPluginId(): Promise<string | undefined>;

  /** --------显示二维码--------- */

  setShowQuickResponseCode(value: boolean): Promise<void>;

  getShowQuickResponseCode(): Promise<boolean>;

  /** --------编辑器显示行号--------- */

  setShowLineNumber(value: boolean): Promise<void>;

  getShowLineNumber(): Promise<boolean>;

  /** --------实时渲染--------- */
  setLiveRendering(value: boolean): Promise<void>;

  getLiveRendering(): Promise<boolean>;
}

const keysOfStorage = {
  accounts: 'accounts',
  defaultAccountId: 'defaultAccountId',
  defaultPluginId: 'defaultPluginId',
  showQuickResponseCode: 'showQuickResponseCode',
  liveRendering: 'liveRendering',
  showLineNumber: 'showLineNumber'
};

class TypedCommonStorage implements TypedCommonStorageInterface {
  store: CommonStorage;

  constructor() {
    this.store = new ChromeSyncStorageImpl();
  }

  getPreference = async (): Promise<PreferenceStorage> => {
    const accounts = await this.getAccounts();
    const defaultPluginId = await this.getDefaultPluginId();
    const defaultAccountId = await this.getDefaultAccountId();
    const showQuickResponseCode = await this.getShowQuickResponseCode();
    const showLineNumber = await this.getShowLineNumber();
    const liveRendering = await this.getLiveRendering();
    return {
      accounts,
      defaultPluginId,
      defaultAccountId,
      showQuickResponseCode,
      showLineNumber,
      liveRendering
    };
  };

  deleteAccountByAccessToken = async (accessToken: string) => {
    const accounts = await this.getAccounts();
    await this.store.set(
      keysOfStorage.accounts,
      accounts.filter(account => account.accessToken !== accessToken)
    );
  };

  addAccount = async (account: AccountPreference) => {
    const accounts = await this.getAccounts();
    accounts.push(account);
    await this.store.set(keysOfStorage.accounts, accounts);
  };

  getAccounts = async () => {
    const value = await this.store.get<AccountPreference[]>(
      keysOfStorage.accounts
    );
    if (!value) {
      return [];
    }
    return value;
  };

  setDefaultAccountId = async (value: string) => {
    await this.store.set(keysOfStorage.defaultAccountId, value);
  };

  getDefaultAccountId = async () => {
    return this.store.get<string>(keysOfStorage.defaultAccountId);
  };

  setDefaultPluginId = async (value: string) => {
    await this.store.set(keysOfStorage.defaultPluginId, value);
  };
  getDefaultPluginId = async () => {
    return this.store.get<string>(keysOfStorage.defaultPluginId);
  };

  setShowQuickResponseCode = async (value: boolean) => {
    await this.store.set(keysOfStorage.showQuickResponseCode, value);
  };
  getShowQuickResponseCode = async () => {
    const value = await this.store.get<boolean>(
      keysOfStorage.showQuickResponseCode
    );
    return value !== false;
  };

  setShowLineNumber = async (value: boolean) => {
    await this.store.set(keysOfStorage.showLineNumber, value);
  };
  getShowLineNumber = async () => {
    const value = await this.store.get<boolean>(keysOfStorage.showLineNumber);
    return value !== false;
  };

  setLiveRendering = async (value: boolean) => {
    await this.store.set(keysOfStorage.liveRendering, value);
  };
  getLiveRendering = async () => {
    const value = await this.store.get<boolean>(keysOfStorage.liveRendering);
    return value !== false;
  };
}

export default new TypedCommonStorage() as TypedCommonStorageInterface;
