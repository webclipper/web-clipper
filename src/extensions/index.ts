import { IExtensionWithId } from './common';

const context = require.context('./extensions', true, /\.(ts|tsx)$/);

const contextMenusContext = require.context('./contextMenus', true, /\.(ts|tsx)$/);

export const contextMenus = contextMenusContext.keys().map(key => {
  const id = key.slice(2, key.length - 3);
  const Test = contextMenusContext(key).default;
  return {
    id,
    contextMenu: Test,
  };
});

export const extensions: IExtensionWithId[] = context.keys().map(key => {
  const id = key.slice(2, key.length - 3);
  return {
    ...context(key).default,
    id,
    router: `/plugins/${id}`,
  };
});
