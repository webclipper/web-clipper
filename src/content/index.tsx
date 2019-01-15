import { ActionMessageType } from '../enums/actionMessageType';
import { ActionMessage } from '../model/Message';
import * as styles from './index.scss';
import TurndownService from 'turndown';
import * as Readability from 'readability';
import Highlighter from '../services/common/highlight';
import AreaSelector from '../services/common/areaSelector';

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

chrome.runtime.onMessage.addListener(
  async (message: ActionMessage, _, sendResponse) => {
    if (
      !message.action ||
      message.action !== ActionMessageType.GET_FULL_PAGE_MARKDOWN
    ) {
      return;
    }
    const $body = $('html').clone();
    $body.find('script').remove();
    $body.find('style').remove();
    $body.removeClass();
    sendResponse(turndownService.turndown($body.html()));
    return true;
  }
);

chrome.runtime.onMessage.addListener(
  async (message: ActionMessage, _, sendResponse) => {
    if (
      !message.action ||
      message.action !== ActionMessageType.GET_READABILITY_MARKDOWN
    ) {
      return;
    }
    let documentClone = document.cloneNode(true);
    let article = new Readability(documentClone).parse();

    sendResponse(turndownService.turndown(article.content));
    return true;
  }
);

chrome.runtime.onMessage.addListener(
  async (message: ActionMessage, _, sendResponse) => {
    if (
      !message.action ||
      message.action !== ActionMessageType.GET_DOCUMENT_INFO
    ) {
      return;
    }
    sendResponse({
      title: document.title,
      url: document.URL
    });
    return true;
  }
);

chrome.runtime.onMessage.addListener(
  async (message: ActionMessage, _, sendResponse) => {
    if (
      !message.action ||
      message.action !== ActionMessageType.CLEAN_SELECT_ITEM
    ) {
      return;
    }
    $(`.${styles.toolFrame}`).toggle();
    new Highlighter().start().then(re => {
      $(re).remove();
      $(`.${styles.toolFrame}`).toggle();
      sendResponse(true);
    });
    return true;
  }
);

chrome.runtime.onMessage.addListener(
  (message: ActionMessage, _, sendResponse) => {
    if (
      !message.action ||
      message.action !== ActionMessageType.GET_SELECT_ITEM
    ) {
      return;
    }
    $(`.${styles.toolFrame}`).toggle();
    new Highlighter().start().then(re => {
      $(`.${styles.toolFrame}`).toggle();
      sendResponse(turndownService.turndown(re));
    });
    return true;
  }
);

chrome.runtime.onMessage.addListener(
  (message: ActionMessage, _, sendResponse) => {
    if (
      !message.action ||
      message.action !== ActionMessageType.GET_SELECT_AREA
    ) {
      return;
    }
    $(`.${styles.toolFrame}`).toggle();
    new AreaSelector().start().then((re: any) => {
      $(`.${styles.toolFrame}`).toggle();
      sendResponse(re);
    });
    return true;
  }
);
