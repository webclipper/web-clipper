export interface LocaleModel {
  antd: any;
  name: string;
  locale: string;
  alias: string[];
  messages: {
    [key: string]: string;
  };
}

export function removeEmptyKeys(params: LocaleModel['messages']): LocaleModel['messages'] {
  const result: LocaleModel['messages'] = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== 'PR_IS_WELCOME') {
      result[key] = params[key];
    }
  });
  return result;
}
