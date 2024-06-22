import { IContentScriptService } from '@/service/common/contentScript';
import { IExtensionContainer, IExtensionService } from '@/service/common/extension';
import Container, { Service } from 'typedi';
import { IWorkerService } from '../common';

class WorkerService implements IWorkerService {
  constructor() {}
  async changeIcon(iconColor: string): Promise<void> {
    if (iconColor === 'light') {
      chrome.action.setIcon({ path: 'icon-dark.png' });
    } else {
      chrome.action.setIcon({ path: 'icon.png' });
    }
  }
  async initContextMenu(): Promise<void> {
    const extensionContainer = Container.get(IExtensionContainer);
    const extensionService = Container.get(IExtensionService);
    await extensionContainer.init();
    await extensionService.init();
    const contextMenus = extensionContainer.contextMenus;
    const currentContextMenus = contextMenus.filter(
      (p) => !extensionService.DisabledExtensionIds.includes(p.id)
    );
    chrome.contextMenus.removeAll(() => {
      for (const iterator of currentContextMenus) {
        const Factory = iterator.contextMenu;
        const instance = new Factory();
        chrome.contextMenus.create({
          id: iterator.id,
          title: instance.manifest.name,
          contexts: instance.manifest.contexts as any[],
        });
      }
    });
  }
}

Service(IWorkerService)(WorkerService);
