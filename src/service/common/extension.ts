export interface Extension {}

export interface IExtensionService {
  getDefault(): Promise<string>;

  setDefault(id: string): Promise<void>;

  disableExtension(id: string): Promise<void>;

  disabledAutomaticExtension(id: string): Promise<void>;
}
