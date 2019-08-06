import '@babel/polyfill';
import React from 'react';
import * as styles from './app.scss';
import dva, { router } from 'dva';
import { createMemoryHistory } from 'history';
import createLogger from 'dva-logger';
import { Action } from 'dva-model-creator';
import preference from '@/pages/preference';
import Complete from '@/pages/complete/complete';
import PluginPage from '@/pages/plugin/Page';
import Tool from '@/pages/tool';
import clipper from '@/models/clipper';
import version from '@/models/version';
import extension from '@/models/extension';
import userPreference from '@/models/userPreference';
import createLoading from 'dva-loading';

const { Route, Switch, Router, withRouter } = router;

function withTool(WrappedComponent: any): any {
  return () => {
    const ToolWith = withRouter(Tool as any);
    const WrappedComponentWith = withRouter(WrappedComponent);

    return (
      <React.Fragment>
        <ToolWith></ToolWith>
        <WrappedComponentWith></WrappedComponentWith>
      </React.Fragment>
    );
  };
}

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

app.use(createLoading());

app.use(
  createLogger({
    predicate: (_: Function, { type }: Action<any>) => {
      return (
        !type.endsWith('@@end') && !type.endsWith('@@start') && !type.startsWith('@@DVA_LOADING')
      );
    },
  })
);

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

app.model(clipper);
app.model(userPreference);
app.model(version);
app.model(extension);

app.start(element);
