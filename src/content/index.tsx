import * as QRCode from 'qrcode';
import * as Readability from 'readability';
import * as styles from './index.scss';
import AreaSelector from 'common/areaSelector';
import Highlighter from 'common/highlight';
import TurndownService from 'turndown';
import * as turndownPluginGfm from 'turndown-plugin-gfm';
import { MessageListenerCombiner } from 'common/ListenerCombiner';
import {
  asyncHideTool,
  asyncRemoveTool,
  asyncRunScript,
  clickIcon,
  doYouAliveNow,
} from 'actions';
import { ContentScriptContext } from 'extensions/interface';

const turndownService = new TurndownService();

turndownService.addRule('lazyLoadImage', {
  filter: ['img'],
  replacement: function(_: any, node: any) {
    const attributes = ['data-src', 'data-original-src'];
    for (const attribute of attributes) {
      let dataSrc: string = node.getAttribute(attribute);
      if (dataSrc) {
        if (dataSrc.startsWith('//')) {
          dataSrc = `${window.location.protocol}${dataSrc}`;
        }
        return `![](${dataSrc})`;
      }
    }
    return `![](${node.getAttribute('src')})`;
  },
});
turndownService.use(turndownPluginGfm.gfm);

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
    const context: ContentScriptContext = {
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
