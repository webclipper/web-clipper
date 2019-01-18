import { Action } from 'redux';

const defaultState: UserPreferenceStore = {
  haveImageService: false,
  closeQRCode: false
};

export function userPreference(
  state: UserPreferenceStore = defaultState,
  _action: Action
): UserPreferenceStore {
  return state;
}
