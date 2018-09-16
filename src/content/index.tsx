import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ActionMessageType } from '../enums/actionMessageType';
import { ActionMessage } from '../model/Message';
import 'antd-style';
import ClipperToolContainer from '../pages/clippertool';
import { ToolStore } from '../store/ClipperTool';


chrome.runtime.onMessage.addListener((message: ActionMessage, _, sendResponse) => {
    if (!message.action || message.action !== ActionMessageType.DO_YOU_ALIVE_NOW) {
        return;
    }
    sendResponse(true);
});


//用来存放之后全部的内容

const yuqueClipperToolContainerId = 'yuque-clipper-tool-container';
$('body').append(`<div id=${yuqueClipperToolContainerId} class="yuque-clipper-tool-container-antd"></div>`);
$(`#${yuqueClipperToolContainerId}`).hide();
const appState = new ToolStore(yuqueClipperToolContainerId);

chrome.runtime.onMessage.addListener(async (message: ActionMessage, _, __) => {
    if (!message.action || message.action !== ActionMessageType.ICON_CLICK) {
        return;
    }
    if (!appState.initialization) {
        try {
            ReactDOM.render(<ClipperToolContainer toolState={appState} />,
                document.getElementById(yuqueClipperToolContainerId)
            );
            $(`#${yuqueClipperToolContainerId}`).toggle();
            await appState.init();
            appState.initialization = true;
        } catch (err) {
            chrome.runtime.sendMessage({
                action: ActionMessageType.GO_TO_SETTINGS,
            });
            console.log(err.message);
            return;
        }
    } else {
        $(`#${yuqueClipperToolContainerId}`).toggle();
    }
});
