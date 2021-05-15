import { IPermissionsService } from '@/service/common/permissions';
import { Container } from 'typedi';
import { ContextMenuExtension } from '../../contextMenus';
import pako from 'pako';

class ContextMenu extends ContextMenuExtension {
  static id = 'contextMenus.saveMHTML.save';

  constructor() {
    super({
      admin: true,
      name: '保存 MHTML',
      description: '保存 MHTML',
      version: '0.0.1',
      contexts: ['page'],
    });
  }

  async run(tab: chrome.tabs.Tab): Promise<void> {
    await Container.get(IPermissionsService).request({
      permissions: ['pageCapture'],
    });
    const mhtml = await this.saveAsMHTML(tab.id!);
    const title = tab.title;
    const url = tab.url;
    const memory = await mhtml.arrayBuffer();
    const view = new Uint8Array(memory);
    const value = pako.deflate(view, { to: 'string' });
    console.log({ value, title, url });
  }

  private saveAsMHTML(tabId: number) {
    return new Promise<Blob>(resolve => {
      chrome.pageCapture.saveAsMHTML(
        {
          tabId,
        },
        resolve
      );
    });
  }
}

export default ContextMenu;
