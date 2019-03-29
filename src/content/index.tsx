import * as Readability from 'readability';
import * as styles from './index.scss';
import Highlighter from '../services/common/highlight';
import TurndownService from 'turndown';
import { AnyAction, isType } from 'typescript-fsa';
import {
  asyncHideTool,
  asyncRemoveTool,
  asyncRunScript,
} from '../store/actions/userPreference';
import AreaSelector from '../services/common/areaSelector';
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
  },
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
  if (isType(action, asyncRunScript.started)) {
    const toggleClipper = () => {
      $(`.${styles.toolFrame}`).toggle();
    };

    if (action) {
      // @ts-ignore
      // eslint-disable-next-line
      const context: any = {
        $,
        turndown: turndownService,
        Highlighter,
        toggleClipper,
        Readability,
        document,
        AreaSelector,
      };
      if (action.payload) {
        (async () => {
          try {
            // eslint-disable-next-line
            const response = await eval(action.payload);
            sendResponse(response);
          } catch (_error) {
            console.log(_error);
            sendResponse('');
          }
        })();
      }
      return true;
    }
  }
});
