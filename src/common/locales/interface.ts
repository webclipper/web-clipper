export interface LocaleModel {
  antd: any;
  name: string;
  locale: string;
  alias: string[];
  messages: {
    [key: string]: string;
  };
}
