import { RepoPublicType } from '../../../enums';

export interface CommonStorage {

  set(key: string, value: any): Promise<{}>;

  get(key: string): Promise<any>;
}

export class ChromeSyncStoregeImpl implements CommonStorage {

  public async set(key: string, item: Object): Promise<{}> {
    return new Promise((resolve, reject) => {
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

  public async get(key: string): Promise<undefined | Object> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, (item) => {
        let err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve(item[key]);
        }
      });
    });
  }
}

export interface StorageUserInfo {
  token: string;
  baseURL: string;
  defualtBookId?: number;
  defualtDocumentPublic?: RepoPublicType;
}

class TypedCommonStorage {
  store: CommonStorage
  constructor() {
    this.store = new ChromeSyncStoregeImpl();
  }
  async saveUserInfo(userInfo: StorageUserInfo) {
    await this.store.set('userInfo', userInfo);
  }
  async getUserInfo(): Promise<StorageUserInfo> {
    return this.store.get('userInfo');
  }
  async getUserSetting(): Promise<StorageUserInfo> {
    return this.store.get('userInfo');
  }
}

export default new TypedCommonStorage();
