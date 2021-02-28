import { IContentScriptService } from '@/service/common/contentScript';

export interface IContextMenuProperties {
  id: string;
  title: string;
  contexts: string[];
}

export interface IContextMenuExtension {
  run(id: chrome.tabs.Tab, context: IContextMenuContext): Promise<void>;
}

export interface IContextMenuContext {
  contentScriptService: IContentScriptService;
  initContentScriptService(id: number): Promise<void>;
}

export abstract class ContextMenuExtension implements IContextMenuExtension {
  constructor(public properties: IContextMenuProperties) {}

  abstract run(id: chrome.tabs.Tab, context: IContextMenuContext): Promise<void>;
}
