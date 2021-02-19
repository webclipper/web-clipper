import Container from 'typedi';
import React from 'react';
import dva, { router } from 'dva';
import { createHashHistory } from 'history';
import createLogger from 'dva-logger';
import { Action } from 'dva-model-creator';
import preference from '@/pages/preference';
import Complete from '@/pages/complete/complete';
import PluginPage from '@/pages/plugin/Page';
import Tool from '@/pages/tool';
import clipper from '@/models/clipper';
import userPreference from '@/models/userPreference';
import createLoading from 'dva-loading';
import LocalWrapper from './locale';
import { localStorageService, syncStorageService } from '@/common/chrome/storage';
import localeService from '@/common/locales';
import AuthPage from '@/pages/auth';
import LoginPage from '@/pages/login';
import account from '@/models/account';
import { message } from 'antd';
import config from '@/config';
import { IConfigService } from '@/service/common/config';
import { ILocalStorageService, ISyncStorageService } from '@/service/common/storage';
import { IPowerpackService } from '@/service/common/powerpack';
import './app.less';
import { ITrackService } from '@/service/common/track';
Container.set(ILocalStorageService, localStorageService);
Container.set(ISyncStorageService, syncStorageService);
import '@/service/preference/browser/preferenceService';
import { IPreferenceService } from '@/service/common/preference';

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

export default async () => {
  await syncStorageService.init();
  await localStorageService.init();
  await localeService.init();
  Container.get(IConfigService).load();
  Container.get(IPowerpackService).startup();
  Container.get(ITrackService).init();
  await Container.get(IPreferenceService).init();
  const app = dva({
    namespacePrefixWarning: false,
    history: createHashHistory(),
    onError: e => {
      (e as any).preventDefault();
      message.destroy();
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
            <Route path="/editor" component={withTool(PluginPage)} />
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
  app.start('#app');
};
