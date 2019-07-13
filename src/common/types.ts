import { History } from 'history';
import { Dispatch } from 'react';
import { UserPreferenceStore } from '@/common/modelTypes/userPreference';
import { ClipperStore } from '@/common/modelTypes/clipper';
import { DvaLoadingState } from 'dva-loading';
import { VersionStore } from './modelTypes/version';

export * from '@/common/modelTypes/userPreference';
export * from '@/common/modelTypes/clipper';

export interface DvaRouterProps {
  history: History;
  dispatch: Dispatch<any>;
}

interface DvaLoadingState {
  global: boolean;
  models: { [type: string]: boolean | undefined };
  effects: { [type: string]: boolean | undefined };
}

export interface GlobalStore {
  clipper: ClipperStore;
  userPreference: UserPreferenceStore;
  version: VersionStore;
  loading: DvaLoadingState;
}
