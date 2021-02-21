import { LocaleModel, removeEmptyKeys } from './interface';

const context = require.context('./data', true, /\.[t|j]s$/);

export const locales = context.keys().map(key => {
  const model = context(key).default as LocaleModel;
  return {
    ...model,
    messages: removeEmptyKeys(model.messages),
  };
});
