import { ClipperPreiviewDataTypeEnum } from './../../../enums/ClipperDataTypeEnum';

export interface CommonStorage {
  set(key: string, value: any): Promise<void>;
  get<T>(key: string): Promise<T>;
}

export class ChromeSyncStoregeImpl implements CommonStorage {
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
            resolve({} as T);
          }
        }
      });
    });
  }
}

export interface StorageUserInfo {
  token: string;
  baseURL: string;
  defualtBookId?: number;
  /** 默认的剪藏类型 */
  defaultClipperType?: ClipperPreiviewDataTypeEnum | '';
  closeQRCode?: boolean;
}

export interface TypedCommonStorageInterface {
  setUserSetting(userInfo: StorageUserInfo): Promise<void>;

  getUserSetting(): Promise<StorageUserInfo>;
}

class TypedCommonStorage implements TypedCommonStorageInterface {
  store: CommonStorage;

  constructor() {
    this.store = new ChromeSyncStoregeImpl();
  }

  setUserSetting = async (userInfo: StorageUserInfo) => {
    await this.store.set('userInfo', userInfo);
  };

  getUserSetting = async (): Promise<StorageUserInfo> => {
    return this.store.get<StorageUserInfo>('userInfo');
  };
}

export default new TypedCommonStorage();
