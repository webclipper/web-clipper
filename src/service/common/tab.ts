import { Token } from 'typedi';
export interface Tab {
  id?: number;
  title?: string;
  url?: string;
}

export interface CaptureVisibleTabOptions {
  quality?: number;

  format?: string;
}
export interface ITabService {
  getCurrent(): Promise<Tab>;

  closeCurrent(): Promise<void>;

  remove(tabId: number): Promise<void>;

  captureVisibleTab(option: CaptureVisibleTabOptions | number): Promise<string>;

  sendMessage<T>(tabId: number, message: any): Promise<T>;

  sendActionToCurrentTab<T>(action: any): Promise<T>;
}

export const ITabService = new Token<ITabService>();
