import * as Readability from 'readability';
import * as styles from './index.scss';
import Highlighter from '../common/highlight';
import AreaSelector from '../common/areaSelector';
import TurndownService from 'turndown';
import * as QRCode from 'qrcode';
import {
  asyncHideTool,
  asyncRemoveTool,
  asyncRunScript,
  clickIcon,
  doYouAliveNow,
} from '../store/actions';
import { MessageListenerCombiner } from '../common/ListenerCombiner';

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

const listeners = new MessageListenerCombiner()
  .case(doYouAliveNow, (_payload, _sender, sendResponse) => {
    sendResponse(true);
    return true;
  })
  .case(asyncHideTool.started, () => {
    $(`.${styles.toolFrame}`).hide();
  })
  .case(asyncRemoveTool.started, () => {
    $(`.${styles.toolFrame}`).remove();
  })
  .case(clickIcon, () => {
    if ($(`.${styles.toolFrame}`).length === 0) {
      $('body').append(
        `<iframe src="${chrome.extension.getURL('tool.html')}" class=${
          styles.toolFrame
        }></iframe>`
      );
    } else {
      $(`.${styles.toolFrame}`).toggle();
    }
  })
  .case(asyncRunScript.started, (script, _sender, sendResponse) => {
    const toggleClipper = () => {
      $(`.${styles.toolFrame}`).toggle();
    };
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
      QRCode,
    };
    if (script) {
      (async () => {
        try {
          // eslint-disable-next-line
          const response = await eval(script);
          sendResponse(response);
        } catch (_error) {
          console.log(_error);
          sendResponse('');
        }
      })();
    }
    return true;
  });

chrome.runtime.onMessage.addListener(listeners.handle);
