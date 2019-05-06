import { takeEvery, fork, all, takeLatest } from 'redux-saga/effects';
import { AsyncActionCreators, Action } from './typescript-fsa/index';

export default class SagaHelper {
  private sagas: any[];
  private sagaMap: {
    [key: string]: any;
  };

  constructor() {
    this.sagas = [];
    this.sagaMap = {};
  }

  takeEvery = <Params, Result, Error = {}>(
    actionCreator: AsyncActionCreators<Params, Result, Error>,
    worker: (action: Action<Params>) => any
  ) => {
    const watchFunction = function* watchFunction() {
      yield takeEvery(actionCreator.started.type, worker);
    };
    this.sagas.push(watchFunction);
    this.sagaMap[actionCreator.started.type] = worker;
    return this;
  };

  takeLatest = <Params, Result, Error = {}>(
    actionCreator: AsyncActionCreators<Params, Result, Error>,
    worker: (action: Action<Params>) => any
  ) => {
    const watchFunction = function* watchFunction() {
      yield takeLatest(actionCreator.started.type, worker);
    };
    this.sagaMap[actionCreator.started.type] = worker;
    this.sagas.push(watchFunction);
    return this;
  };

  combine = () => {
    let sagas = this.sagas.map(saga => fork(saga));
    return function* watchFunction() {
      yield all(sagas);
    };
  };
}
