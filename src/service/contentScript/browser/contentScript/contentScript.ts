import { IContentScriptService } from '@/service/common/contentScript';
import { Service } from 'typedi';
import styles from '@/browser/content/index.less';
import * as browser from '@web-clipper/chrome-promise';

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
}

Service(IContentScriptService)(ContentScriptService);
