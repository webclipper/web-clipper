import { SerializedExtensionWithId, IExtensionManifest } from '@web-clipper/extensions';

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
  defaultExtensionId?: string | null;
}

export const LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY = 'local.extensions.disabled.extensions';
export const LOCAL_EXTENSIONS_DISABLED_AUTOMATIC_EXTENSIONS_KEY =
  'local.extensions.disabled.automatic.extensions';
