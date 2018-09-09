import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ActionMessageType } from '../enums/actionMessageType';
import { ActionMessage } from '../model/Message';
import 'antd-style';
import ClipperTool from '../pages/clippertool';

chrome.runtime.onMessage.addListener((message: ActionMessage, _, sendResponse) => {
    if (!message.action || message.action !== ActionMessageType.DO_YOU_ALIVE_NOW) {
        return;
    }
    sendResponse(true);
});


//用来存放之后全部的内容
$('body').append('<div id="yuque-clipper-tool-container" class="yuque-clipper-tool-container-antd"></div>');
$('#yuque-clipper-tool-container').append('<div id="yuque-clipper-tool"></div>');
$('#yuque-clipper-tool').hide();


ReactDOM.render(<ClipperTool close={() => { $('#yuque-clipper-tool').toggle() }} />,
    document.getElementById('yuque-clipper-tool')
);

chrome.runtime.onMessage.addListener((message: ActionMessage, _, __) => {
    if (!message.action || message.action !== ActionMessageType.ICON_CLICK) {
        return;
    }
    $('#yuque-clipper-tool').toggle();
});
