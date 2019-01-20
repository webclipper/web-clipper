import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();
import { CLIPPER } from './actionTypes';

export const asyncFetchRepository = actionCreator.async<
void,
{
repositories: Repository[];
},
void
>(CLIPPER.ASYNC_FETCH_REPOSITORY);

export const updateTitle = actionCreator<{ title: string }>(
  CLIPPER.UPDATE_TITLE
);

export const asyncCreateDocument = actionCreator.async<void, void, void>(
  CLIPPER.ASYNC_CREATE_DOCUMENT
);

export const asyncUploadImage = actionCreator.async<void, void, void>(
  CLIPPER.ASYNC_UPLOAD_IMAGE
);

export const selectRepository = actionCreator<{ repositoryId: string }>(
  CLIPPER.SELECT_REPOSITORY
);

export const startCreateRepository = actionCreator(
  CLIPPER.START_CREATE_REPOSITORY
);

export const cancelCreateRepository = actionCreator(
  CLIPPER.CANCEL_CREATE_REPOSITORY
);

export const changeCreateRepositoryTitle = actionCreator<{
repositoryTitle: string;
}>(CLIPPER.CHANGE_CREATE_REPOSITORY_TITLE);

export const asyncCreateRepository = actionCreator.async<void, void, void>(
  CLIPPER.ASYNC_CREATE_REPOSITORY
);
