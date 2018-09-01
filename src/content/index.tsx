import { testStorageInChrome } from '../services/common/store/test';

testStorageInChrome().then((_) => {
    console.log('storage is ok in content');
}).catch((err: Error) => {
    console.log(err.message);
});
