import { History } from 'history';
import { Dispatch } from 'react';

export interface DvaRouterProps {
  history: History;
  dispatch: Dispatch<any>;
}
