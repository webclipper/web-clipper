import { Token } from 'typedi';

export interface IContentScriptService {
  hide(): Promise<void>;
  remove(): Promise<void>;
  checkStatus(): Promise<boolean>;
  toggle(): Promise<void>;
  runScript(id: string, lifeCycle: 'run' | 'destroy'): Promise<void>;
}

export const IContentScriptService = new Token<IContentScriptService>();
