import update from 'immutability-helper';
import { Action } from 'redux';
import {
  asyncAddAccount,
  asyncDeleteAccount,
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber,
  asyncSetShowQuickResponseCode,
  asyncUpdateCurrentAccountIndex,
  cancelCreateAccount,
  initUserPreference,
  updateCreateAccountForm,
  asyncSetDefaultPluginId,
} from '../actions/userPreference';
import {
  asyncVerificationAccessToken,
  startCreateAccount,
} from './../actions/userPreference';
import { backendServices } from '../../const';
import { isType } from 'typescript-fsa';
import {
  getFullPagePlugin,
  getSelectItemPlugin,
  getReadabilityPlugin,
  removeElement,
  bookmarkPlugin,
  selectElementTool,
  uploadImage,
} from '../../plugin';

const defaultState: UserPreferenceStore = {
  accounts: [],
  plugins: [
    removeElement,
    getSelectItemPlugin,
    getReadabilityPlugin,
    getFullPagePlugin,
    bookmarkPlugin,
    selectElementTool,
    uploadImage,
  ],
  showQuickResponseCode: true,
  showLineNumber: true,
  liveRendering: true,
  initializeForm: {
    show: false,
    verified: false,
    verifying: false,
    type: {
      value: 'yuque',
    },
    host: {
      value: backendServices.yuque.api,
    },
    userInfo: { name: '' },
    repositories: [],
  },
};

export function userPreference(
  state: UserPreferenceStore = defaultState,
  action: Action
): UserPreferenceStore {
  if (isType(action, asyncSetShowLineNumber.done)) {
    return update(state, {
      showLineNumber: {
        $set: action.payload.result.value,
      },
    });
  }
  if (isType(action, asyncSetEditorLiveRendering.done)) {
    return update(state, {
      liveRendering: {
        $set: action.payload.result.value,
      },
    });
  }
  if (isType(action, asyncSetShowQuickResponseCode.done)) {
    return update(state, {
      showQuickResponseCode: {
        $set: action.payload.result.value,
      },
    });
  }
  if (isType(action, asyncSetDefaultPluginId.done)) {
    return update(state, {
      defaultPluginId: {
        $set: action.payload.params.pluginId,
      },
    });
  }
  if (isType(action, cancelCreateAccount)) {
    return update(state, {
      initializeForm: {
        $set: defaultState.initializeForm,
      },
    });
  }
  if (isType(action, startCreateAccount)) {
    return update(state, {
      initializeForm: {
        show: {
          $set: true,
        },
      },
    });
  }
  if (isType(action, asyncAddAccount.done)) {
    return update(state, {
      accounts: {
        $set: action.payload.result.accounts,
      },
      defaultAccountId: {
        $set: action.payload.result.defaultAccountId,
      },
      initializeForm: {
        $set: {
          ...defaultState.initializeForm,
          show: false,
        },
      },
    });
  }
  if (isType(action, asyncUpdateCurrentAccountIndex.done)) {
    return update(state, {
      defaultAccountId: {
        $set: action.payload.result.id,
      },
    });
  }
  if (isType(action, asyncDeleteAccount.done)) {
    return update(state, {
      accounts: {
        $set: action.payload.result.accounts,
      },
      defaultAccountId: {
        $set: action.payload.result.defaultAccountId,
      },
    });
  }
  if (isType(action, initUserPreference)) {
    return update(state, {
      $merge: action.payload,
    });
  }
  if (isType(action, asyncVerificationAccessToken.done)) {
    return update(state, {
      initializeForm: {
        $merge: {
          verified: true,
          verifying: false,
          repositories: action.payload.result.repositories,
          userInfo: action.payload.result.userInfo,
        },
      },
    });
  }
  if (isType(action, asyncVerificationAccessToken.failed)) {
    return update(state, {
      initializeForm: {
        $merge: {
          verified: state.initializeForm.verified,
          verifying: false,
          repositories: state.initializeForm.repositories,
        },
      },
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
              value: backendServices[type.value as string].api,
            },
            repositories: [],
          },
        },
      });
    }
    if (action.payload.defaultRepositoryId) {
      return update(state, {
        initializeForm: {
          $merge: action.payload,
        },
      });
    }
    return update(state, {
      initializeForm: {
        $merge: action.payload,
        verified: {
          $set: false,
        },
      },
    });
  }
  return state;
}
