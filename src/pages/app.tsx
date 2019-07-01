import React from 'react';
import * as styles from './app.scss';
import Complete from './complete/complete';
import PluginPage from './plugin/Page';
import clipper from '../models/clipper';
import userPreference from '../models/userPreference';
import Tool from './tool';
import dva, { router } from 'dva';
import { createMemoryHistory } from 'history';
import createLogger from 'dva-logger';
import { Action } from 'dva-model-creator';
import preference from './preference';
import '@babel/polyfill';
import { DvaRouterProps } from 'common/types';

const { Route, Switch, Router } = router;

if (document.getElementById(styles.app) == null) {
  const element = document.createElement('div');
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

function withTool(WrappedComponent: any) {
  return (props: DvaRouterProps) => (
    <React.Fragment>
      <Tool history={props.history} />
      <WrappedComponent history={props.history} />
    </React.Fragment>
  );
}

app.router(router => {
  return (
    <Router history={router!.history}>
      <Switch>
        <Route exact path="/" component={Tool} />
        <Route exact path="/complete" component={Complete} />
        <Route exact path="/preference" component={withTool(preference)} />
        <Route path="/plugins/:id" component={withTool(PluginPage)} />
      </Switch>
    </Router>
  );
});

app.start(document.getElementById(styles.app)!);
