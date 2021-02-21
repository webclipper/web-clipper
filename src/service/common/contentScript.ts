import { Token } from 'typedi';

export interface IToggleConfig {
  pathname: string;
  query?: string;
}
export interface IContentScriptService {
  hide(): Promise<void>;
  remove(): Promise<void>;
  checkStatus(): Promise<boolean>;
  toggle(config?: IToggleConfig): Promise<void>;
  runScript(id: string, lifeCycle: 'run' | 'destroy'): Promise<void>;
  getSelectionMarkdown(): Promise<string>;
  getPageUrl(): Promise<string>;
}

export const IContentScriptService = new Token<IContentScriptService>();
