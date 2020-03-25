import { IContentScriptService } from '@/service/common/contentScript';
import { Service, Inject } from 'typedi';
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
import { IExtensionContainer } from '@/service/common/extension';

const turndownService = new TurndownService({ codeBlockStyle: 'fenced' });
turndownService.use(plugins);
class ContentScriptService implements IContentScriptService {
  constructor(@Inject(IExtensionContainer) private extensionContainer: IExtensionContainer) {}

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

  async runScript(id: string, lifeCycle: 'run' | 'destroy') {
    const extensions = this.extensionContainer.extensions;
    const extension = extensions.find(o => o.id === id);
    console.log(
      'extension',
      extensions.map(o => o.id),
      id
    );
    const lifeCycleFunc = extension?.extensionLifeCycle[lifeCycle];
    if (!lifeCycleFunc) {
      return;
    }
    await localStorageService.init();
    const toggleClipper = () => {
      $(`.${styles.toolFrame}`).toggle();
    };
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
    return lifeCycleFunc(context);
  }
}

Service(IContentScriptService)(ContentScriptService);
