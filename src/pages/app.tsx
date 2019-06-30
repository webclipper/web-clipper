import React from 'react';
import * as styles from './app.scss';
import Complete from './complete/complete';
import PluginPage from './plugin/Page';
import clipper from '../models/clipper';
import userPreference from '../models/userPreference';
import Tool from './tool';
import dva from 'dva';
import { createMemoryHistory } from 'history';
import { routerRedux, Route, Switch } from 'dva/router';
import createLogger from 'dva-logger';
import { Action } from 'dva-model-creator';
import preference from './preference';

const { ConnectedRouter } = routerRedux;

if (document.getElementById(styles.app) == null) {
  const element = document.createElement('div');
  element.setAttribute('id', styles.app);
  document.body.appendChild(element);
  element.className = styles.app;
}

const app = dva({
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
  return ({ history }: any) => {
    return (
      <React.Fragment>
        <Tool history={history} />
        <WrappedComponent history={history} />
      </React.Fragment>
    );
  };
}

app.router(router => {
  return (
    <ConnectedRouter history={router!.history}>
      <Switch>
        <Route exact path="/" component={Tool} />
        <Route path="/plugins/:id" component={withTool(PluginPage)} />
        <Route exact path="/complete" component={Complete} />
        <Route exact path="/preference" component={withTool(preference)} />
      </Switch>
    </ConnectedRouter>
  );
});

app.start(document.getElementById(styles.app)!);
