import { actionTypeHelper } from './actionTypeHelper';

export const USER_PREFERENCE = actionTypeHelper('USER_PREFERENCE', {
  INIT_USER_PREFERENCE: '',
  UPDATE_INITIALIZE_FORM: '',
  ASYNC_POST_INITIALIZE_FORM: ''
});

export const USER_INFO = actionTypeHelper('USER_INFO', {
  ASYNC_FETCH_USER_INFO: ''
});

export const CLIPPER = actionTypeHelper('CLIPPER', {
  ASYNC_FETCH_REPOSITORY: '获取知识库列表',
  ASYNC_CREATE_REPOSITORY: '创建知识库',
  ASYNC_CREATE_DOCUMENT: '创建问的',
  ASYNC_UPLOAD_IMAGE: '上传图片',
  SELECT_REPOSITORY: '选择知识库',
  UPDATE_TITLE: '',
  START_CREATE_REPOSITORY: '',
  CANCEL_CREATE_REPOSITORY: '',
  CHANGE_CREATE_REPOSITORY_TITLE: ''
});
