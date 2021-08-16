import { Token } from 'typedi';

export interface IWebClipperConfiguration {
  yuque_oauth: {
    clientId: string;
    callback: string;
    scope: string;
  };
}
export interface IConfigurationService {
  getConfiguration(): IWebClipperConfiguration;

  init(): void;
}

export const IConfigurationService = new Token<IConfigurationService>();
