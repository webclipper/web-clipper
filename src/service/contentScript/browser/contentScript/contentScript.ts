import { IContentScriptService } from '@/service/common/contentScript';
import { Service } from 'typedi';
import styles from '@/service/contentScript/browser/contentScript/contentScript.less';
import * as browser from '@web-clipper/chrome-promise';
import * as QRCode from 'qrcode';
import * as Readability from '@web-clipper/readability';
import AreaSelector from '@web-clipper/area-selector';
import Highlighter from '@web-clipper/highlight';
import plugins from '@web-clipper/turndown';
import TurndownService from 'turndown';
import { ContentScriptContext } from '@web-clipper/extensions';
import { localStorageService } from '@/common/chrome/storage';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/types';

const turndownService = new TurndownService({ codeBlockStyle: 'fenced' });
turndownService.use(plugins);
class ContentScriptService implements IContentScriptService {
  async remove() {
    $(`.${styles.toolFrame}`).remove();
  }
  async hide() {
    $(`.${styles.toolFrame}`).hide();
  }
  async toggle() {
    if ($(`.${styles.toolFrame}`).length === 0) {
      $('body').append(
        `<iframe src="${browser.extension.getURL('tool.html')}" class=${styles.toolFrame}></iframe>`
      );
    } else {
      $(`.${styles.toolFrame}`).toggle();
    }
  }
  async checkStatus() {
    return true;
  }

  async runScript(script: string) {
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
    $(`.${styles.toolFrame}`).blur();
    // eslint-disable-next-line
    return eval(script);
  }
}

Service(IContentScriptService)(ContentScriptService);
