import { IExtensionWithId, ToolExtension, TextExtension } from './common';
import { IContextMenuExtensionFactory } from './contextMenus';

const context = require.context('./extensions', true, /\.(ts|tsx)$/);

const contextMenusContext = require.context('./contextMenus', true, /\.(ts|tsx)$/);

export const contextMenus = contextMenusContext.keys().map(key => {
  const ContextMenuExtensionFactory: IContextMenuExtensionFactory = contextMenusContext(key)
    .default;
  return {
    id: ContextMenuExtensionFactory.id,
    contextMenu: ContextMenuExtensionFactory,
  };
});

export const extensions: IExtensionWithId[] = context.keys().map(key => {
  const id = key.slice(2, key.length - 3);
  const extension = context(key).default;
  if (extension instanceof ToolExtension || extension instanceof TextExtension) {
    return {
      ...context(key).default,
      id,
      router: `/plugins/${id}`,
    };
  }
  return {
    factory: extension,
    id,
    router: `/plugins/${id}`,
  };
});
