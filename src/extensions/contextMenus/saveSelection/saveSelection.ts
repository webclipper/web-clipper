import { ContextMenuExtension, IContextMenuContext } from '../../contextMenus';
import localeService from '@/common/locales';
import { stringify } from 'qs';

class ContextMenu extends ContextMenuExtension {
  constructor() {
    super({
      id: 'contextMenus.selection.save',
      title: localeService.format({
        id: 'contextMenus.selection.save.title',
        defaultMessage: 'Save selection',
      }),
      contexts: ['selection'],
    });
  }

  async run(tab: chrome.tabs.Tab, context: IContextMenuContext): Promise<void> {
    await context.initContentScriptService(tab.id!);
    const content = await context.contentScriptService.getSelectionMarkdown();
    const note = localeService.format(
      {
        id: 'contextMenus.selection.save.template',
      },
      { content, url: await context.contentScriptService.getPageUrl(), title: tab.title }
    );
    context.contentScriptService.toggle({
      pathname: '/editor',
      query: stringify({ markdown: note }),
    });
  }
}

export default ContextMenu;
