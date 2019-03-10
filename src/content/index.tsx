import * as Readability from 'readability';
import * as styles from './index.scss';
import Highlighter from '../services/common/highlight';
import AreaSelector from '../services/common/areaSelector/index';
import TurndownService from 'turndown';
import { AnyAction, isType } from 'typescript-fsa';
import {
  asyncHideTool,
  asyncRemoveTool
} from '../store/actions/userPreference';
import {
  asyncRunPlugin,
  asyncTakeScreenshot,
  asyncRunToolPlugin
} from '../store/actions/clipper';
import { clickIcon, doYouAliveNow } from '../store/actions/browser';

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

chrome.runtime.onMessage.addListener((action: AnyAction, _, sendResponse) => {
  if (isType(action, doYouAliveNow)) {
    sendResponse(true);
    return true;
  }
});

chrome.runtime.onMessage.addListener((action: AnyAction, _, __) => {
  if (isType(action, clickIcon)) {
    if ($(`.${styles.toolFrame}`).length === 0) {
      $('body').append(
        `<iframe src="${chrome.extension.getURL('tool.html')}" class=${
          styles.toolFrame
        }></iframe>`
      );
    } else {
      $(`.${styles.toolFrame}`).toggle();
    }
    return true;
  }
});

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

chrome.runtime.onMessage.addListener((action: AnyAction, _, __) => {
  if (isType(action, asyncHideTool.started)) {
    $(`.${styles.toolFrame}`).hide();
  }
});

chrome.runtime.onMessage.addListener((action: AnyAction, _, __) => {
  if (isType(action, asyncRemoveTool.started)) {
    $(`.${styles.toolFrame}`).remove();
  }
});

chrome.runtime.onMessage.addListener((action: AnyAction, _, sendResponse) => {
  if (isType(action, asyncTakeScreenshot.started)) {
    $(`.${styles.toolFrame}`).hide();
    (async () => {
      const response = await new AreaSelector().start();
      sendResponse(response);
    })();
    return true;
  }
});

chrome.runtime.onMessage.addListener((action: AnyAction, _, __) => {
  if (isType(action, asyncTakeScreenshot.done)) {
    $(`.${styles.toolFrame}`).show();
  }
});

chrome.runtime.onMessage.addListener((action: AnyAction, _, sendResponse) => {
  if (isType(action, asyncRunToolPlugin.started)) {
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
        const response = await eval(
          action.payload.plugin.processingDocumentObjectModel!
        );
        sendResponse(response);
      })();
      return true;
    }
  }
});
