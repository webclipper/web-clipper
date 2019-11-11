import { AccountStore } from './modelTypes/account';
import { RouteComponentProps } from 'react-router';
import { Dispatch } from 'react';
import { UserPreferenceStore } from '@/common/modelTypes/userPreference';
import { ClipperStore } from '@/common/modelTypes/clipper';
import { DvaLoadingState } from 'dva-loading';
import { VersionStore } from './modelTypes/version';
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
  version: VersionStore;
  loading: DvaLoadingState;
  extension: ExtensionStore;
  router: {
    location: {
      search: string;
      pathname: string;
    };
  };
}

export interface IUserInfo {
  name: string;
  email: string;
  avatar_url: string;
  expire_date: string;
}

export interface IResponse<T> {
  result: T;
  message: string;
}
