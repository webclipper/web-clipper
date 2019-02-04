import {
  asyncVerificationAccessToken,
  startCreateAccount
} from './../actions/userPreference';
import update from 'immutability-helper';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import {
  initUserPreference,
  updateCreateAccountForm,
  cancelCreateAccount,
  asyncAddAccount,
  asyncDeleteAccount,
  asyncUpdateCurrentAccountIndex,
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber
} from '../actions/userPreference';
import { backendServices } from '../../const';

const defaultState: UserPreferenceStore = {
  accounts: [],
  currentAccountIndex: 100,
  showQuickResponseCode: true,
  showLineNumber: true,
  liveRendering: true,
  initializeForm: {
    show: false,
    verified: false,
    verifying: false,
    type: {
      value: 'yuque'
    },
    host: {
      value: backendServices.yuque.api
    },
    userInfo: { name: '' },
    repositories: []
  }
};

export function userPreference(
  state: UserPreferenceStore = defaultState,
  action: Action
): UserPreferenceStore {
  if (isType(action, asyncSetShowLineNumber.done)) {
    return update(state, {
      showLineNumber: {
        $set: action.payload.result.value
      }
    });
  }
  if (isType(action, asyncSetEditorLiveRendering.done)) {
    return update(state, {
      liveRendering: {
        $set: action.payload.result.value
      }
    });
  }
  if (isType(action, cancelCreateAccount)) {
    return update(state, {
      initializeForm: {
        $set: defaultState.initializeForm
      }
    });
  }
  if (isType(action, startCreateAccount)) {
    return update(state, {
      initializeForm: {
        show: {
          $set: true
        }
      }
    });
  }
  if (isType(action, asyncAddAccount.done)) {
    return update(state, {
      accounts: {
        $set: action.payload.result.accounts
      },
      initializeForm: {
        $set: {
          ...defaultState.initializeForm,
          show: false
        }
      }
    });
  }
  if (isType(action, asyncUpdateCurrentAccountIndex.done)) {
    return update(state, {
      currentAccountIndex: {
        $set: action.payload.result.index
      }
    });
  }
  if (isType(action, asyncDeleteAccount.done)) {
    return update(state, {
      accounts: {
        $set: action.payload.result.accounts
      }
    });
  }
  if (isType(action, initUserPreference)) {
    return update(state, {
      $merge: action.payload
    });
  }
  if (isType(action, asyncVerificationAccessToken.done)) {
    return update(state, {
      initializeForm: {
        $merge: {
          verified: true,
          verifying: false,
          repositories: action.payload.result.repositories,
          userInfo: action.payload.result.userInfo
        }
      }
    });
  }
  if (isType(action, asyncVerificationAccessToken.failed)) {
    return update(state, {
      initializeForm: {
        $merge: {
          verified: state.initializeForm.verified,
          verifying: false,
          repositories: state.initializeForm.repositories
        }
      }
    });
  }
  if (isType(action, updateCreateAccountForm)) {
    let type = action.payload.type;
    if (type && backendServices[type.value as string]) {
      const { show, verified, verifying } = state.initializeForm;
      return update(state, {
        initializeForm: {
          $set: {
            show,
            verified,
            verifying,
            type: action.payload.type,
            userInfo: action.payload.userInfo,
            host: {
              value: backendServices[type.value as string].api
            },
            repositories: []
          }
        }
      });
    }
    if (action.payload.defaultRepositoryId) {
      return update(state, {
        initializeForm: {
          $merge: action.payload
        }
      });
    }
    return update(state, {
      initializeForm: {
        $merge: action.payload
      }
    });
  }
  return state;
}
