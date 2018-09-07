import { testStorageInChrome } from '../services/common/store/test';
import 'antd-style';
import { ActionMessageType } from '../enums/actionMessageType';
import { ActionMessage } from '../../dist/js/lib/model/Message';

testStorageInChrome().then((_) => {
    console.log('storage is ok in content');
}).catch((err: Error) => {
    console.log(err.message);
});

chrome.runtime.onMessage.addListener((message: ActionMessage, _, sendResponse) => {
    if (!message.action || message.action !== ActionMessageType.DO_YOU_ALIVE_NOW) {
        return;
    }
    sendResponse(true);
});
