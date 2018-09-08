import { ActionMessage } from '../model/Message';
import { ActionMessageType } from '../enums';

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
        //Todo 发消息提醒
        return;
    }
    const massage: ActionMessage = {
        action: ActionMessageType.ICON_CLICK,
    };
    chrome.tabs.sendMessage(tab.id, massage);
});
