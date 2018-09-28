import { ChromeSyncStoregeImpl } from './index';
import { StorageKeyEnum } from '../../../enums';
import * as _ from 'lodash';

async function testStorageInChrome(): Promise<void> {
    const storage = new ChromeSyncStoregeImpl();
    //测试储存数字
    await storage.set(StorageKeyEnum.TEST_KEY, 1);
    if (await storage.get(StorageKeyEnum.TEST_KEY) !== 1) {
        return Promise.reject(new Error('store 储存数字的功能失效'));
    }
    //测试储存字符串
    await storage.set(StorageKeyEnum.TEST_KEY, '123');
    if (await storage.get(StorageKeyEnum.TEST_KEY) !== '123') {
        return Promise.reject(new Error('store 储存字符串的功能失效'));
    }
    //测试储存对象
    const testData3 = {
        testKey1: 'testKey1',
        testKey2: 2,
        testKey3: {
            key: 'key',
            value: 'value'
        }
    };
    await storage.set(StorageKeyEnum.TEST_KEY, testData3);
    if (!_.isEqual(testData3, await storage.get(StorageKeyEnum.TEST_KEY))) {
        return Promise.reject(new Error('store 储存对象的功能失效'));
    }
    //测试储存字符串数组

    const testData4 = ['1', '1', '2', '3'];

    await storage.set(StorageKeyEnum.TEST_KEY, testData4);
    if (!_.isEqual(testData4, await storage.get(StorageKeyEnum.TEST_KEY))) {
        return Promise.reject(new Error('store 储存字符串数组的功能失效'));
    }

    //测试储存数字数组
    const testData5 = [1, 1, 2, 3];
    await storage.set(StorageKeyEnum.TEST_KEY, testData5);
    if (!_.isEqual(testData5, await storage.get(StorageKeyEnum.TEST_KEY))) {
        return Promise.reject(new Error('store 储存数字数组的功能失效'));
    }
    //测试储存对象数组
    const testData6 = [{ key: 1 }, { key: 1 }, { key: 2 }];
    await storage.set(StorageKeyEnum.TEST_KEY, testData6);
    if (!_.isEqual(testData6, await storage.get(StorageKeyEnum.TEST_KEY))) {
        return Promise.reject(new Error('store 储存对象数组的功能失效'));
    }
    //测试储存混合对象数组
    const testData7 = ['1', 1, { value: 1 }, { key: 1 }, { key: 1 }, { key: 2 }];
    await storage.set(StorageKeyEnum.TEST_KEY, testData7);
    if (!_.isEqual(testData7, await storage.get(StorageKeyEnum.TEST_KEY))) {
        return Promise.reject(new Error('store 储存对象数组的功能失效'));
    }
    return Promise.resolve();
}

export { testStorageInChrome };
