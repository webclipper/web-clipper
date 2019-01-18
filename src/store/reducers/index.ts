import { HistoryType } from './../index';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import clipper from './clipper';
import { userInfo } from './userInfo';
import { userPreference } from './userPreference';

export default (history: HistoryType) =>
  combineReducers({
    router: connectRouter(history),
    clipper,
    userInfo,
    userPreference
  });
