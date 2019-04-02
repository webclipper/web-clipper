import {
  asyncFetchRepository,
  updateTitle,
  selectRepository,
  initTabInfo,
  asyncCreateDocument,
  asyncChangeAccount,
  changeData,
} from '../actions/clipper';
import {
  initUserPreference,
  asyncRunExtension,
} from '../actions/userPreference';
import update from 'immutability-helper';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

const defaultState: ClipperStore = {
  title: '',
  currentAccountId: '',
  repositories: [],
  clipperData: {},
  loadingRepositories: true,
  creatingDocument: false,
};

const reducer = reducerWithInitialState(defaultState)
  .case(asyncChangeAccount.started, state => ({
    ...state,
    loadingRepositories: true,
  }))
  .case(
    asyncChangeAccount.done,
    (state, { params: { id }, result: { repositories } }) => {
      return update(state, {
        loadingRepositories: {
          $set: false,
        },
        currentAccountId: {
          $set: id,
        },
        repositories: {
          $set: repositories,
        },
        currentRepository: {
          // eslint-disable-next-line no-undefined
          $set: undefined,
        },
      });
    }
  )
  .case(initUserPreference, (state, { defaultAccountId }) =>
    update(state, {
      currentAccountId: {
        $set: defaultAccountId || '',
      },
    })
  )
  .case(asyncFetchRepository.done, (state, { result: { repositories } }) => ({
    ...state,
    loadingRepositories: false,
    repositories,
  }))
  .case(asyncFetchRepository.failed, state => ({
    ...state,
    loadingRepositories: false,
  }))
  .case(updateTitle, (state, { title }) => ({
    ...state,
    title,
  }))
  .case(selectRepository, (state, { repositoryId }) => {
    const currentRepository = state.repositories.find(
      o => o.id === repositoryId
    );
    return {
      ...state,
      currentRepository,
    };
  })
  .case(initTabInfo, (state, { title, url }) => ({
    ...state,
    title,
    url,
  }))
  .case(asyncCreateDocument.started, state => ({
    ...state,
    creatingDocument: true,
  }))
  .case(asyncCreateDocument.done, (state, { result: completeStatus }) => ({
    ...state,
    creatingDocument: false,
    completeStatus,
  }))
  .case(asyncCreateDocument.failed, state => ({
    ...state,
    creatingDocument: false,
  }))
  .case(asyncRunExtension.done, (state, { result }) =>
    update(state, {
      clipperData: {
        [result.pathname]: {
          $set: result.result,
        },
      },
    })
  )
  .case(changeData, (state, { data, pathName }) =>
    update(state, {
      clipperData: {
        [pathName]: {
          $set: data,
        },
      },
    })
  );

export default reducer;
