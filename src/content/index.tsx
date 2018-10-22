import { ActionMessageType } from '../enums/actionMessageType';
import { ActionMessage } from '../model/Message';
import * as styles from './index.scss';
import TurndownService from 'turndown';
import * as Readability from 'readability';
import Highlighter from '../services/common/highlight';

chrome.runtime.onMessage.addListener((message: ActionMessage, _, sendResponse) => {
  if (!message.action || message.action !== ActionMessageType.DO_YOU_ALIVE_NOW) {
    return;
  }
  sendResponse(true);
});

//用来存放之后全部的内容
chrome.runtime.onMessage.addListener(async (message: ActionMessage, _, __) => {
  if (!message.action || message.action !== ActionMessageType.ICON_CLICK) {
    return;
  }
  if ($(`.${styles.toolFrame}`).length === 0) {
    $('body').append(`<iframe src=${chrome.extension.getURL('tool.html')} class=${styles.toolFrame}></iframe>`);
  } else {
    $(`.${styles.toolFrame}`).toggle();
  }
});

chrome.runtime.onMessage.addListener(async (message: ActionMessage, _, sendResponse) => {
  if (!message.action || message.action !== ActionMessageType.GET_FULL_PAGE_MARKDOWN) {
    return;
  }
  const $body = $('html').clone();
  $body.find('script').remove();
  $body.find('style').remove();
  $body.removeClass();
  const turndownService = TurndownService();
  sendResponse(turndownService.turndown($body.html()));
  return true;
});

chrome.runtime.onMessage.addListener(async (message: ActionMessage, _, sendResponse) => {
  if (!message.action || message.action !== ActionMessageType.GET_READABILITY_MARKDOWN) {
    return;
  }
  let documentClone = document.cloneNode(true);
  let article = new Readability(documentClone).parse();
  const turndownService = TurndownService();
  sendResponse(turndownService.turndown(article.content));
  return true;
});

chrome.runtime.onMessage.addListener(async (message: ActionMessage, _, sendResponse) => {
  if (!message.action || message.action !== ActionMessageType.GET_DOCUMENT_INFO) {
    return;
  }
  sendResponse({
    title: document.title,
    url: document.URL
  });
  return true;
});

chrome.runtime.onMessage.addListener(async (message: ActionMessage, _, sendResponse) => {
  if (!message.action || message.action !== ActionMessageType.CLEAN_SELECT_ITEM) {
    return;
  }
  $(`.${styles.toolFrame}`).toggle();
  new Highlighter().start().then(re => {
    $(re).remove();
    $(`.${styles.toolFrame}`).toggle();
    sendResponse(true);
  });
  return true;
});

chrome.runtime.onMessage.addListener((message: ActionMessage, _, sendResponse) => {
  if (!message.action || message.action !== ActionMessageType.GET_SELECT_ITEM) {
    return;
  }
  $(`.${styles.toolFrame}`).toggle();
  new Highlighter().start().then(re => {
    $(`.${styles.toolFrame}`).toggle();
    const turndownService = TurndownService();
    sendResponse(turndownService.turndown(re));
  });
  return true;
});
