import { History } from 'history';
import { Dispatch } from 'react';
import { UserPreferenceStore } from '@/common/modelTypes/userPreference';
import { ClipperStore } from '@/common/modelTypes/clipper';

export * from '@/common/modelTypes/userPreference';
export * from '@/common/modelTypes/clipper';

export interface DvaRouterProps {
  history: History;
  dispatch: Dispatch<any>;
}

export interface GlobalStore {
  clipper: ClipperStore;
  userPreference: UserPreferenceStore;
}
