import 'antd-style';
import { ActionMessageType } from '../enums/actionMessageType';
import { ActionMessage } from '../model/Message';

chrome.runtime.onMessage.addListener((message: ActionMessage, _, sendResponse) => {
    if (!message.action || message.action !== ActionMessageType.DO_YOU_ALIVE_NOW) {
        return;
    }
    sendResponse(true);
});


//用来存放之后全部的内容
$('body').append('<div id="yuque-clipper-tool-container"></div>');
$('#yuque-clipper-tool-container').append('<div id="yuque-clipper-tool"></div>');
$('#yuque-clipper-tool').hide();

chrome.runtime.onMessage.addListener((message: ActionMessage, _, __) => {
    if (!message.action || message.action !== ActionMessageType.ICON_CLICK) {
        return;
    }
    $('#yuque-clipper-tool').toggle();
});
