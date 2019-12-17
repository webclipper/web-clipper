import { AccountStore } from './modelTypes/account';
import { RouteComponentProps } from 'react-router';
import { Dispatch } from 'react';
import { UserPreferenceStore } from '@/common/modelTypes/userPreference';
import { ClipperStore } from '@/common/modelTypes/clipper';
import { DvaLoadingState } from 'dva-loading';
import { ExtensionStore } from './modelTypes/extensions';

export * from '@/common/modelTypes/userPreference';
export * from '@/common/modelTypes/clipper';
export * from '@/common/modelTypes/account';

export type DvaRouterProps = {
  dispatch: Dispatch<any>;
} & RouteComponentProps;

interface DvaLoadingState {
  global: boolean;
  models: { [type: string]: boolean | undefined };
  effects: { [type: string]: boolean | undefined };
}

export interface GlobalStore {
  account: AccountStore;
  clipper: ClipperStore;
  userPreference: UserPreferenceStore;
  loading: DvaLoadingState;
  extension: ExtensionStore;
  router: {
    location: {
      search: string;
      pathname: string;
    };
  };
}

export interface IResponse<T> {
  result: T;
  message: string;
}
