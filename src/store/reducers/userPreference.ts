import update from 'immutability-helper';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import {
  updateInitializeForm,
  initUserPreference
} from '../actions/userPreference';

const defaultState: UserPreferenceStore = {
  haveImageService: false,
  closeQRCode: false,
  initializeForm: {
    host: {
      value: 'https://www.yuque.com'
    }
  }
};

export function userPreference(
  state: UserPreferenceStore = defaultState,
  action: Action
): UserPreferenceStore {
  if (isType(action, updateInitializeForm)) {
    const from = Object.assign({}, state.initializeForm, action.payload);
    return update(state, {
      initializeForm: {
        $set: from
      }
    });
  }
  if (isType(action, initUserPreference)) {
    const {
      defaultRepositoryId,
      defaultClipperType,
      accessToken
    } = action.payload.userPreferenceStore;

    return update(state, {
      accessToken: {
        $set: accessToken
      },
      defaultRepositoryId: {
        $set: defaultRepositoryId
      },
      defaultClipperType: {
        $set: defaultClipperType
      }
    });
  }
  return state;
}
