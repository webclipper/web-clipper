import { AccountPreference, ImageHosting } from 'common/types';
export interface PreferenceStorage {
  accounts: AccountPreference[];
  imageHosting: ImageHosting[];
  defaultPluginId?: string | null;
  defaultAccountId?: string;
  showLineNumber: boolean;
  liveRendering: boolean;
}
