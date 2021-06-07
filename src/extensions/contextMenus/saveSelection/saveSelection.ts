import { ContextMenuExtension, IContextMenuContext } from '../../contextMenus';
import localeService from '@/common/locales';
import { stringify } from 'qs';

class ContextMenu extends ContextMenuExtension {
  static id = 'contextMenus.selection.save';

  constructor() {
    super({
      extensionId: 'contextMenus.selection.save',
      name: `${localeService.format({
        id: 'contextMenus.selection.save.title',
      })} (Alt+S)`,
      description: localeService.format({
        id: 'contextMenus.selection.save.description',
      }),
      config: {
        scheme: {
          type: 'object',
          properties: {
            template: {
              type: 'string',
              title: localeService.format({
                id: 'extension.link.config.template',
              }),
              'x-decorator': 'FormItem',
              'x-component': 'textarea',
              'x-component-props': { autoSize: true },
            },
          },
        },
        default: {
          template: localeService.format({
            id: 'contextMenus.selection.save.template',
          }),
        },
      },
      version: '0.0.1',
      contexts: ['selection'],
    });
  }

  async run(tab: chrome.tabs.Tab, context: IContextMenuContext): Promise<void> {
    await context.initContentScriptService(tab.id!);
    const content = await context.contentScriptService.getSelectionMarkdown();
    const config = (await context.config!) as { template: string };
    const note = localeService.format(
      {
        id: 'not_exist',
        defaultMessage: config.template,
      },
      { CONTENT: content, URL: await context.contentScriptService.getPageUrl(), TITLE: tab.title }
    );
    context.contentScriptService.toggle({
      pathname: '/editor',
      query: stringify({ markdown: note }),
    });
  }
}

export default ContextMenu;
