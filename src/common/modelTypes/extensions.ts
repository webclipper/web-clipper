import { SerializedExtensionWithId, IExtensionManifest } from '@/extensions/interface';

export interface ExtensionRegistry {
  readonly name: string;
  readonly description?: string;
  readonly icon?: string;
  readonly extensions: IExtensionManifest[];
  readonly i18n: {
    [key: string]: {
      readonly name: string;
      readonly description?: string;
      readonly icon?: string;
    };
  };
}

export interface ExtensionStore {
  extensions: SerializedExtensionWithId[];
  registry: ExtensionRegistry[];
}
