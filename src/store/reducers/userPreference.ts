import { asyncPostInitializeForm } from './../actions/userPreference';
import update from 'immutability-helper';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import {
  updateInitializeForm,
  initUserPreference,
  asyncChangeDefaultRepository
} from '../actions/userPreference';

const defaultState: UserPreferenceStore = {
  haveImageService: false,
  closeQRCode: false,
  initializeForm: {
    uploading: false
  }
};

export function userPreference(
  state: UserPreferenceStore = defaultState,
  action: Action
): UserPreferenceStore {
  if (isType(action, updateInitializeForm)) {
    const from = Object.assign(
      {
        uploading: state.initializeForm.uploading
      },
      state.initializeForm,
      action.payload
    );
    return update(state, {
      initializeForm: {
        $set: from
      }
    });
  }
  if (isType(action, asyncPostInitializeForm.started)) {
    return update(state, {
      initializeForm: {
        uploading: {
          $set: true
        }
      }
    });
  }
  if (isType(action, asyncPostInitializeForm.done)) {
    return update(state, {
      initializeForm: {
        uploading: {
          $set: false
        }
      }
    });
  }
  if (isType(action, asyncPostInitializeForm.failed)) {
    return update(state, {
      initializeForm: {
        uploading: {
          $set: false
        }
      }
    });
  }
  if (isType(action, initUserPreference)) {
    const {
      defaultRepositoryId,
      defaultClipperType,
      accessToken,
      baseHost
    } = action.payload.userPreferenceStore;

    return update(state, {
      accessToken: {
        $set: accessToken
      },
      defaultRepositoryId: {
        $set: defaultRepositoryId
      },
      baseHost: {
        $set: baseHost
      },
      defaultClipperType: {
        $set: defaultClipperType
      }
    });
  }
  if (isType(action, asyncChangeDefaultRepository.done)) {
    const { defaultRepositoryId } = action.payload.params;
    return update(state, {
      defaultRepositoryId: {
        $set: defaultRepositoryId
      }
    });
  }
  return state;
}
