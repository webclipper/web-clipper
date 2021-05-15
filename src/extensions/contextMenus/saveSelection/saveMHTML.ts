import { IPermissionsService } from '@/service/common/permissions';
import { Container } from 'typedi';
import { ContextMenuExtension } from '../../contextMenus';

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
    chrome.pageCapture.saveAsMHTML(
      {
        tabId: tab.id!,
      },
      async (res: Blob) => {
        console.log(await res.text());
      }
    );
  }
}

export default ContextMenu;
