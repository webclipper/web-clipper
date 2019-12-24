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

  remove(tabId: number): Promise<void>;

  captureVisibleTab(option: CaptureVisibleTabOptions | number): Promise<string>;
}

export const ITabService = new Token<ITabService>();
