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

export abstract class AbstractTabService {
  closeCurrentTab = async () => {
    const current = await this.getCurrent();
    return this.remove(current.id!);
  };

  sendActionToCurrentTab = async <T>(action: any): Promise<T> => {
    const current = await this.getCurrent();
    if (!current || !current.id) {
      throw new Error('No Tab');
    }
    return this.sendMessage(current.id, action);
  };

  abstract getCurrent(): Promise<Tab>;
  abstract remove(tabId: number): Promise<void>;
  abstract sendMessage<T>(tabId: number, message: any): Promise<T>;
}

export const ITabService = new Token<ITabService>();
