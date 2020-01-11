import * as QRCode from 'qrcode';
import * as Readability from '@web-clipper/readability';
import styles from './index.less';
import AreaSelector from '@web-clipper/area-selector';
import Highlighter from '@web-clipper/highlight';
import plugins from '@web-clipper/turndown';
import TurndownService from 'turndown';
import { MessageListenerCombiner } from '@web-clipper/message-listener-combiner';
import { clickIcon, doYouAliveNow } from 'browserActions/browser';
import { removeTool, runScript, hideTool } from 'browserActions/message';
import { ContentScriptContext } from '@web-clipper/extensions';
import * as browser from '@web-clipper/chrome-promise';
import { localStorageService } from '@/common/chrome/storage';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/types';

const turndownService = new TurndownService({ codeBlockStyle: 'fenced' });
turndownService.use(plugins);

const listeners = new MessageListenerCombiner()
  .case(doYouAliveNow, (_payload, _sender, sendResponse) => {
    sendResponse(true);
    return true;
  })
  .case(hideTool, () => {
    $(`.${styles.toolFrame}`).hide();
  })
  .case(removeTool, () => {
    $(`.${styles.toolFrame}`).remove();
  })
  .case(clickIcon, () => {
    if ($(`.${styles.toolFrame}`).length === 0) {
      $('body').append(
        `<iframe src="${browser.extension.getURL('tool.html')}" class=${styles.toolFrame}></iframe>`
      );
    } else {
      $(`.${styles.toolFrame}`).toggle();
    }
  })
  .case(runScript, (script, _sender, sendResponse) => {
    if (script) {
      (async () => {
        await localStorageService.init();
        const toggleClipper = () => {
          $(`.${styles.toolFrame}`).toggle();
        };
        // @ts-ignore
        // eslint-disable-next-line
        const context: ContentScriptContext = {
          locale: localStorageService.get(LOCAL_USER_PREFERENCE_LOCALE_KEY, navigator.language),
          turndown: turndownService,
          Highlighter: Highlighter,
          toggleClipper,
          Readability,
          document,
          AreaSelector,
          QRCode,
          $,
        };
        try {
          $(`.${styles.toolFrame}`).blur();
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

browser.runtime.onMessage.addListener(listeners.handle);
