import { TypedCommonStorageInterface, CommonStorage } from './interface';
export * from './interface';
import * as browser from '@web-clipper/chrome-promise';
import { TypedCommonStorage } from './typedCommonStorage';

export class ChromeSyncStorageImpl implements CommonStorage {
  public async set(key: string, item: Object): Promise<void> {
    let tempObject: any = {};
    tempObject[key] = item;
    return browser.storage.sync.set(tempObject);
  }

  public async get<T>(key: string): Promise<T> {
    const items = await browser.storage.sync.get(key);
    return items[key];
  }
}

export default new TypedCommonStorage(new ChromeSyncStorageImpl()) as TypedCommonStorageInterface;
