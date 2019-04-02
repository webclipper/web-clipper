import clipper from './clipper';
import userPreference from './userPreference';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { HistoryType } from './../index';

export default (history: HistoryType) =>
  combineReducers({
    router: connectRouter(history),
    clipper,
    userPreference,
  });
