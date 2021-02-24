export interface LocaleModel {
  name: string;
  locale: string;
  alias: string[];
  messages: {
    [key: string]: string;
  };
}

export function removeEmptyKeys(
  params: LocaleModel['messages'],
  defaultMessage: LocaleModel['messages']
): LocaleModel['messages'] {
  const result: LocaleModel['messages'] = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== '') {
      result[key] = params[key];
    } else {
      if (defaultMessage[key] !== '') {
        result[key] = defaultMessage[key];
      }
    }
  });
  return result;
}
