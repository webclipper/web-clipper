import 'regenerator-runtime/runtime';
import React from 'react';
import * as styles from './app.scss';
import dva, { router } from 'dva';
import { createHashHistory } from 'history';
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
import LocalWrapper from './locale';
import { localStorageService, syncStorageService } from '@/common/chrome/storage';
import localeService from '@/common/locales';
import { initGa } from '@/common/gs';
import AuthPage from '@/pages/auth';
import LoginPage from '@/pages/login';
import account from '@/models/account';
import { message } from 'antd';
import config from '@/config';

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

(async () => {
  initGa();
  await syncStorageService.init();
  await localStorageService.init();
  await localeService.init();
  const app = dva({
    namespacePrefixWarning: false,
    history: createHashHistory(),
    onError: e => {
      (e as any).preventDefault();
      message.error(e.message);
    },
  });
  app.use(createLoading());

  if (config.createLogger) {
    app.use(
      createLogger({
        predicate: (_: Function, { type }: Action<any>) => {
          return (
            !type.endsWith('@@end') &&
            !type.endsWith('@@start') &&
            !type.startsWith('@@DVA_LOADING')
          );
        },
      })
    );
  }

  app.router(router => {
    return (
      <LocalWrapper>
        <Router history={router!.history}>
          <Switch>
            <Route exact path="/" component={Tool} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/auth" component={AuthPage} />
            <Route exact path="/complete" component={Complete} />
            <Route path="/preference/:id" component={withTool(preference)} />
            <Route path="/plugins/:id" component={withTool(PluginPage)} />
          </Switch>
        </Router>
      </LocalWrapper>
    );
  });

  app.model(account);
  app.model(clipper);
  app.model(userPreference);
  app.model(version);
  app.model(extension);
  app.start(element);
})();
