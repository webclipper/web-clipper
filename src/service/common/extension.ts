import { Token } from 'typedi';
export interface Extension {}

export interface IExtensionService {
  DefaultExtensionId: string | null;

  DisabledExtensionIds: string[];

  DisabledAutomaticExtensionIds: string[];

  toggleDefault(id: string): Promise<void>;

  toggleDisableExtension(id: string): Promise<void>;

  toggleAutomaticExtension(id: string): Promise<void>;
}

export const IExtensionService = new Token<IExtensionService>();
