
import { testStorageInChrome } from '../services/common/store/test';
import { ActionMessage } from '../model/Message';
import { ActionMessageType } from '../enums';

testStorageInChrome().then((_) => {
    console.log('storage is ok in content');
}).catch((err: Error) => {
    console.log(err.message);
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
        console.log('Install Success');
        chrome.tabs.create({ url: chrome.extension.getURL('initialize.html') });
    } else if (details.reason === 'update') {
        console.log('Update Success');
    }
});



async function tabStatus(tabId: number): Promise<any> {
    return new Promise((resolve, _) => {
        const massage: ActionMessage = {
            action: ActionMessageType.DO_YOU_ALIVE_NOW
        };
        chrome.tabs.sendMessage(tabId, massage, (cb: boolean) => {
            if (!cb) {
                resolve(false);
            }
            resolve(true);
        });
    });
}



chrome.browserAction.onClicked.addListener(async (tab: any) => {
    if (!await tabStatus(tab.id)) {
        //todo 发消息提醒
        console.log('tab is not prepare');
        return;
    }
});
