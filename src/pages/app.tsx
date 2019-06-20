import React from 'react';
import * as ReactDOM from 'react-dom';
import * as styles from './app.scss';
import Complete from './complete/complete';
import PluginPage from './plugin/Page';
import Preference from './preference';
import Tool from './tool';
import { configStore, history } from '../store/index';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';

if (document.getElementById(styles.app) == null) {
  const element = document.createElement('div');
  element.setAttribute('id', styles.app);
  document.body.appendChild(element);
  element.className = styles.app;
}

const store = configStore();

function withTool(WrappedComponent: any) {
  return () => (
    <React.Fragment>
      <Tool />
      <WrappedComponent />
    </React.Fragment>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" component={Tool} />
        <Route path="/plugins/:id" component={withTool(PluginPage)} />
        <Route exact path="/complete" component={Complete} />
        <Route exact path="/preference" component={withTool(Preference)} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById(styles.app)
);
