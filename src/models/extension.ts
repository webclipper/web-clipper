import { GlobalStore } from './../common/types';
import { DvaModelBuilder } from 'dva-model-creator';

const initStore: GlobalStore['extension'] = {
  extensions: [],
  registry: [],
};

const builder = new DvaModelBuilder(initStore, 'extension');

export default builder.build();
