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
