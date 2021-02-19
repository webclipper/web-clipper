import { Token } from 'typedi';

export interface IContentScriptService {
  hide(): Promise<void>;
  remove(): Promise<void>;
  checkStatus(): Promise<boolean>;
  toggle(config?: any): Promise<void>;
  runScript(id: string, lifeCycle: 'run' | 'destroy'): Promise<void>;
  getSelectionMarkdown(): Promise<string>;
}

export const IContentScriptService = new Token<IContentScriptService>();
