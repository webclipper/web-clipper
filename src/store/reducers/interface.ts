import { ClipperStore } from './clipper/interface';
import { UserPreferenceStore } from './userPreference/interface';

export interface GlobalStore {
  clipper: ClipperStore;
  userPreference: UserPreferenceStore;
}
