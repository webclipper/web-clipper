import { ActionMessageType } from '../enums/actionMessageType';
import { ActionMessage } from '../model/Message';
import * as styles from './index.scss';
import TurndownService from 'turndown';
import { AnyAction, isType } from 'typescript-fsa';
import { asyncRunPlugin } from '../store/actions/clipper';
import Highlighter from '../services/common/highlight';
import * as Readability from 'readability';

const turndownService = TurndownService();
turndownService.addRule('lazyLoadImage', {
  filter: ['img'],
  replacement: function(_: any, node: any) {
    const dataSrc = node.getAttribute('data-src');
    if (dataSrc) {
      return `![](${dataSrc})`;
    }
    return `![](${node.getAttribute('src')})`;
  }
});

chrome.runtime.onMessage.addListener(
  (message: ActionMessage, _, sendResponse) => {
    if (
      !message.action ||
      message.action !== ActionMessageType.DO_YOU_ALIVE_NOW
    ) {
      return;
    }
    sendResponse(true);
  }
);

//用来存放之后全部的内容
chrome.runtime.onMessage.addListener(
  (message: ActionMessage, _, sendResponse) => {
    if (!message.action || message.action !== ActionMessageType.ICON_CLICK) {
      return;
    }
    if ($(`.${styles.toolFrame}`).length === 0) {
      $('body').append(
        `<iframe src=${chrome.extension.getURL('tool.html')} class=${
          styles.toolFrame
        }></iframe>`
      );
    } else {
      $(`.${styles.toolFrame}`).toggle();
    }
    //todo 这是不对滴
    setTimeout(() => {
      sendResponse(true);
    }, 100);
    return true;
  }
);

chrome.runtime.onMessage.addListener((action: AnyAction, _, sendResponse) => {
  if (isType(action, asyncRunPlugin.started)) {
    const toggleClipper = () => {
      $(`.${styles.toolFrame}`).toggle();
    };

    if (action) {
      // @ts-ignore
      // eslint-disable-next-line
      const context: ClipperPluginContext = {
        $,
        turndown: turndownService,
        Highlighter,
        toggleClipper,
        Readability,
        document
      };
      (async () => {
        // eslint-disable-next-line
        const response = await eval(action.payload.plugin.script);
        sendResponse(response);
      })();
      return true;
    }
  }
});
