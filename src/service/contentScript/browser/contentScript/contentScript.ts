import { IContentScriptService } from '@/service/common/contentScript';
import { Service } from 'typedi';
import styles from '@/browser/content/index.less';

class ContentScriptService implements IContentScriptService {
  async remove() {
    $(`.${styles.toolFrame}`).remove();
  }
  async hide() {
    $(`.${styles.toolFrame}`).hide();
  }
}

Service(IContentScriptService)(ContentScriptService);
