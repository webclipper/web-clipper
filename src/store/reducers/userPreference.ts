import update from 'immutability-helper';
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
import { services } from '../../common/backend/index';
import { extensions } from '../../extensions/index';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

const servicesMeta = services.reduce(
  (previousValue: UserPreferenceStore['servicesMeta'], { type, name }) => {
    previousValue[type] = { name };
    return previousValue;
  },
  {}
);

const defaultState: UserPreferenceStore = {
  accounts: [],
  servicesMeta: servicesMeta,
  extensions: extensions,
  showQuickResponseCode: true,
  showLineNumber: true,
  liveRendering: true,
  initializeForm: {
    type: 'yuque',
    repositories: [],
    visible: false,
    verified: false,
    verifying: false,
  },
};

const reducer = reducerWithInitialState(defaultState)
  .case(
    asyncSetShowLineNumber.done,
    (state, { result: { value: showLineNumber } }) => ({
      ...state,
      showLineNumber,
    })
  )
  .case(
    asyncSetEditorLiveRendering.done,
    (state, { result: { value: liveRendering } }) => ({
      ...state,
      liveRendering,
    })
  )
  .case(
    asyncSetShowQuickResponseCode.done,
    (state, { result: { value: showQuickResponseCode } }) => ({
      ...state,
      showQuickResponseCode,
    })
  )
  .case(
    asyncSetDefaultPluginId.done,
    (state, { params: { pluginId: defaultPluginId } }) => ({
      ...state,
      defaultPluginId,
    })
  )
  .case(
    asyncDeleteAccount.done,
    (state, { result: { accounts, defaultAccountId } }) => ({
      ...state,
      accounts,
      defaultAccountId,
    })
  )
  .case(initUserPreference, (state, payload) => ({
    ...state,
    ...payload,
  }))
  .case(cancelCreateAccount, state => ({
    ...state,
    initializeForm: defaultState.initializeForm,
  }))
  .case(
    asyncAddAccount.done,
    (state, { result: { accounts, defaultAccountId } }) => ({
      ...state,
      initializeForm: defaultState.initializeForm,
      accounts,
      defaultAccountId,
    })
  )
  .case(
    asyncUpdateCurrentAccountIndex.done,
    (state, { result: { id: defaultAccountId } }) => ({
      ...state,
      defaultAccountId,
    })
  )
  .case(
    asyncVerificationAccessToken.done,
    (state, { result: { repositories, userInfo } }) =>
      update(state, {
        initializeForm: {
          $merge: {
            verified: true,
            verifying: false,
            repositories,
            userInfo,
          },
        },
      })
  )
  .case(asyncVerificationAccessToken.failed, state =>
    update(state, {
      initializeForm: {
        $merge: {
          verifying: false,
        },
      },
    })
  )
  .case(updateCreateAccountForm, (state, { defaultRepositoryId, ...rest }) => {
    if (defaultRepositoryId) {
      return update(state, {
        initializeForm: {
          defaultRepositoryId: {
            $set: defaultRepositoryId,
          },
        },
      });
    }
    return update(state, {
      initializeForm: {
        $set: {
          ...state.initializeForm,
          verified: false,
          verifying: false,
          repositories: [],
          defaultRepositoryId,
          ...rest,
        },
      },
    });
  })
  .case(startCreateAccount, state =>
    update(state, {
      initializeForm: {
        visible: {
          $set: true,
        },
      },
    })
  );

export default reducer;
