import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'antd-style';
import * as styles from './app.scss';
import { Provider } from 'react-redux';
import { configStore, history } from '../store/index';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import Tool from './tool';
import Complete from './tool/complete';
import Preference from './preference';

if (document.getElementById(styles.app) == null) {
  const element = document.createElement('div');
  element.setAttribute('id', styles.app);
  document.body.appendChild(element);
  element.className = styles.app;
}

const store = configStore();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" component={Tool} />
        <Route exact path="/complete" component={Complete} />
        <Route exact path="/preference" component={Preference} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById(styles.app)
);
