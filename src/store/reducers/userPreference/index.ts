import update from 'immutability-helper';
import {
  asyncAddAccount,
  asyncDeleteAccount,
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber,
  asyncSetShowQuickResponseCode,
  asyncUpdateCurrentAccountIndex,
  initUserPreference,
  asyncSetDefaultPluginId,
  asyncVerificationAccessToken,
  asyncDeleteImageHosting,
  asyncAddImageHosting,
  asyncEditImageHosting,
  resetAccountForm,
  asyncUpdateAccount,
} from 'actions';
import { services, imageHostingServices } from '../../../common/backend';
import { extensions } from '../../../extensions';
import { reducerWithInitialState } from '../../../common/typescript-fsa-reducers';
import { UserPreferenceStore } from './interface';

const servicesMeta = services.reduce(
  (previousValue, meta) => {
    previousValue[meta.type] = meta;
    return previousValue;
  },
  {} as UserPreferenceStore['servicesMeta']
);

const imageHostingServicesMeta = imageHostingServices.reduce(
  (previousValue, meta) => {
    previousValue[meta.type] = meta;
    return previousValue;
  },
  {} as UserPreferenceStore['imageHostingServicesMeta']
);

const defaultState: UserPreferenceStore = {
  accounts: [],
  imageHosting: [],
  servicesMeta,
  imageHostingServicesMeta,
  extensions: extensions,
  showQuickResponseCode: true,
  showLineNumber: true,
  liveRendering: true,
  initializeForm: {
    repositories: [],
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
  .case(
    asyncAddAccount.done,
    (state, { result: { accounts, defaultAccountId } }) => ({
      ...state,
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
  .case(asyncDeleteImageHosting.done, (state, { result }) =>
    update(state, {
      imageHosting: {
        $set: result,
      },
    })
  )
  .case(asyncAddImageHosting.done, (state, { result }) =>
    update(state, {
      imageHosting: {
        $set: result,
      },
    })
  )
  .case(asyncEditImageHosting.done, (state, { result }) =>
    update(state, {
      imageHosting: {
        $set: result,
      },
    })
  )
  .case(asyncUpdateAccount.done, (state, { result: { accounts } }) =>
    update(state, {
      accounts: {
        $set: accounts,
      },
    })
  )
  .case(
    asyncVerificationAccessToken.done,
    (state, { result: { repositories, userInfo } }) =>
      update(state, {
        initializeForm: {
          $set: {
            verified: true,
            verifying: false,
            repositories,
            userInfo,
          },
        },
      })
  )
  .case(resetAccountForm, state =>
    update(state, {
      initializeForm: {
        $set: defaultState.initializeForm,
      },
    })
  );
export default reducer;
