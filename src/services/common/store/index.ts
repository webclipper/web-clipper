
export interface CommonStorage {
    set(key: string, value: Object): Promise<{}>;

    get(key: string): Promise<undefined | Object>;
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
