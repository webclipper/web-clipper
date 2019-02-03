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
          if (date) {
            resolve(date);
          } else {
            resolve();
          }
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

  /** --------当前账户索引--------- */

  setCurrentAccountIndex(index: number): Promise<void>;

  getCurrentAccountIndex(): Promise<number>;

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
  currentAccountIndex: 'currentAccountIndex',
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

  getPreference = async () => {
    const accounts = await this.getAccounts();
    const defaultPluginId = await this.getDefaultPluginId();
    const currentAccountIndex = await this.getCurrentAccountIndex();
    const showQuickResponseCode = await this.getShowQuickResponseCode();
    const showLineNumber = await this.getShowLineNumber();
    const liveRendering = await this.getLiveRendering();
    return {
      accounts,
      defaultPluginId,
      currentAccountIndex,
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

  setCurrentAccountIndex = async (value: number) => {
    await this.store.set(keysOfStorage.currentAccountIndex, value);
  };
  getCurrentAccountIndex = async () => {
    const value = await this.store.get<number>(
      keysOfStorage.currentAccountIndex
    );
    if (!value) {
      return 0;
    }
    return value;
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
    if (!value) {
      return true;
    }
    return value;
  };

  setShowLineNumber = async (value: boolean) => {
    await this.store.set(keysOfStorage.showLineNumber, value);
  };
  getShowLineNumber = async () => {
    const value = await this.store.get<boolean>(keysOfStorage.showLineNumber);
    if (!value) {
      return true;
    }
    return value;
  };

  setLiveRendering = async (value: boolean) => {
    await this.store.set(keysOfStorage.liveRendering, value);
  };
  getLiveRendering = async () => {
    const value = await this.store.get<boolean>(keysOfStorage.liveRendering);
    if (!value) {
      return true;
    }
    return value;
  };
}

export default new TypedCommonStorage() as TypedCommonStorageInterface;
