
import { testStorageInChrome } from '../services/common/store/test';

testStorageInChrome().then((_) => {
    console.log('storage is ok in content');
}).catch((err: Error) => {
    console.log(err.message);
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
        console.log('安装成功');
        chrome.windows.create({ url: chrome.extension.getURL('initialize.html'), type: 'normal' });
    } else if (details.reason === 'update') {
        console.log('更新成功');
    }
});
