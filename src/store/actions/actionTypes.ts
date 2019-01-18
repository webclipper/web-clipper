import { actionTypeHelper } from './actionTypeHelper';

export const USER_PREFERENCE = actionTypeHelper('USER_PREFERENCE', {
  INIT_USER_PREFERENCE: ''
});

export const USER_INFO = actionTypeHelper('USER_INFO', {
  ASYNC_FETCH_USER_INFO: ''
});

export const CLIPPER = actionTypeHelper('CLIPPER', {
  ASYNC_FETCH_REPOSITORY: '',
  ASYNC_CREATE_REPOSITORY: '',
  ASYNC_CREATE_DOCUMENT: '',
  ASYNC_UPLOAD_IMAGE: '',
  SELECT_REPOSITORY: '',
  UPDATE_TITLE: ''
});
