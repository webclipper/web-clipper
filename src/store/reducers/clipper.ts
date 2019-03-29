/* eslint-disable complexity */
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
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

const defaultState: ClipperStore = {
  title: '',
  currentAccountId: '',
  repositories: [],
  clipperData: {},
  loadingRepositories: true,
  creatingDocument: false,
};

export default function clipper(
  state: ClipperStore = defaultState,
  action: Action
): ClipperStore {
  if (isType(action, asyncChangeAccount.started)) {
    return update(state, {
      loadingRepositories: {
        $set: true,
      },
    });
  }
  if (isType(action, asyncChangeAccount.done)) {
    return update(state, {
      loadingRepositories: {
        $set: false,
      },
      currentAccountId: {
        $set: action.payload.params.id,
      },
      repositories: {
        $set: action.payload.result.repositories,
      },
      currentRepository: {
        // eslint-disable-next-line no-undefined
        $set: undefined,
      },
    });
  }
  if (isType(action, initUserPreference)) {
    const { defaultAccountId } = action.payload;
    return update(state, {
      currentAccountId: {
        $set: defaultAccountId || '',
      },
    });
  }
  if (isType(action, asyncFetchRepository.failed)) {
    return update(state, {
      loadingRepositories: {
        $set: false,
      },
    });
  }
  if (isType(action, asyncFetchRepository.done)) {
    const { repositories } = action.payload.result;
    return update(state, {
      loadingRepositories: {
        $set: false,
      },
      repositories: {
        $set: repositories,
      },
    });
  } else if (isType(action, updateTitle)) {
    return update(state, {
      title: {
        $set: action.payload.title,
      },
    });
  } else if (isType(action, selectRepository)) {
    const currentRepository = state.repositories.find(
      o => o.id === action.payload.repositoryId
    );
    return update(state, {
      currentRepository: {
        $set: currentRepository,
      },
    });
  } else if (isType(action, initTabInfo)) {
    return update(state, {
      url: {
        $set: action.payload.url,
      },
      title: {
        $set: action.payload.title,
      },
    });
  } else if (isType(action, asyncCreateDocument.started)) {
    return update(state, {
      creatingDocument: {
        $set: true,
      },
    });
  } else if (isType(action, asyncCreateDocument.failed)) {
    return update(state, {
      creatingDocument: {
        $set: false,
      },
    });
  } else if (isType(action, asyncCreateDocument.done)) {
    return update(state, {
      creatingDocument: {
        $set: false,
      },
      completeStatus: {
        $set: action.payload.result,
      },
    });
  }
  if (isType(action, asyncRunExtension.done)) {
    const { result } = action.payload;
    return update(state, {
      clipperData: {
        [result.pathname]: {
          $set: result.result,
        },
      },
    });
  }
  if (isType(action, changeData)) {
    const { data, pathName } = action.payload;
    return update(state, {
      clipperData: {
        [pathName]: {
          $set: data,
        },
      },
    });
  }
  return state;
}
