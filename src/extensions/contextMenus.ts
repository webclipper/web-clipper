import { IContentScriptService } from '@/service/common/contentScript';
import { IExtensionManifest } from './common';

export interface IContextMenuProperties {
  id: string;
  title: string;
  contexts: string[];
}

export interface IContextMenuExtension {
  readonly manifest: IExtensionManifest;
  run(id: chrome.tabs.Tab, context: IContextMenuContext): Promise<void>;
}

export interface IContextMenuContext {
  contentScriptService: IContentScriptService;
  initContentScriptService(id: number): Promise<void>;
}

export abstract class ContextMenuExtension implements IContextMenuExtension {
  constructor(public manifest: IExtensionManifest) {}

  abstract run(id: chrome.tabs.Tab, context: IContextMenuContext): Promise<void>;
}

export interface IContextMenuExtensionFactory {
  id: string;
  new (): IContextMenuExtension;
}

export interface IContextMenusWithId {
  id: string;
  contextMenu: IContextMenuExtensionFactory;
}
