import '@babel/polyfill';
import React from 'react';
import * as styles from './app.scss';
import dva, { router } from 'dva';
import { createMemoryHistory } from 'history';
import createLogger from 'dva-logger';
import { Action } from 'dva-model-creator';
import { DvaRouterProps } from 'common/types';
import preference from '@/pages/preference';
import Complete from '@/pages/complete/complete';
import PluginPage from '@/pages/plugin/Page';
import Tool from '@/pages/tool';
import clipper from '@/models/clipper';
import userPreference from '@/models/userPreference';

const { Route, Switch, Router, withRouter } = router;

let element;
if (!element) {
  element = document.createElement('div');
  element.setAttribute('id', styles.app);
  document.body.appendChild(element);
  element.className = styles.app;
}

const app = dva({
  namespacePrefixWarning: false,
  history: createMemoryHistory(),
});

app.use(
  createLogger({
    predicate: (_: Function, { type }: Action<any>) => {
      return !type.endsWith('@@end') && !type.endsWith('@@start');
    },
  })
);

app.model(clipper);
app.model(userPreference);

app.router(router => {
  return (
    <Router history={router!.history}>
      <Switch>
        <Route exact path="/" component={withRouter(Tool)} />
        <Route exact path="/complete" component={withRouter(Complete)} />
        <Route exact path="/preference" component={withTool(preference)} />
        <Route path="/plugins/:id" component={withTool(PluginPage)} />
      </Switch>
    </Router>
  );
});

app.start(element);

function withTool(WrappedComponent: any) {
  return (props: DvaRouterProps) => (
    <React.Fragment>
      <Tool history={props.history} />
      <WrappedComponent history={props.history} />
    </React.Fragment>
  );
}
