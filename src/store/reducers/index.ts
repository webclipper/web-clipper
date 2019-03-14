import clipper from './clipper';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { HistoryType } from './../index';
import { userInfo } from './userInfo';
import { userPreference } from './userPreference';

export default (history: HistoryType) =>
  combineReducers({
    router: connectRouter(history),
    clipper,
    userInfo,
    userPreference,
  });
