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
        alert('暂时无法剪辑此类型的页面。要不刷新试试看？');
        return;
    }
    const massage: ActionMessage = {
        action: ActionMessageType.ICON_CLICK,
    };
    chrome.tabs.sendMessage(tab.id, massage);
});


chrome.runtime.onMessage.addListener(async (message: ActionMessage, _, __) => {
    if (!message.action || message.action !== ActionMessageType.GO_TO_SETTINGS) {
        return;
    }
    chrome.tabs.create({ url: chrome.extension.getURL('initialize.html') });
});
