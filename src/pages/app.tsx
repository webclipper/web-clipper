import 'antd-style';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as styles from './app.scss';
import Complete from './tool/complete';
import Plugins from './plugin/index';
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
  return class HOC extends React.Component {
    render() {
      return (
        <React.Fragment>
          <Tool />
          <WrappedComponent />
        </React.Fragment>
      );
    }
  };
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path='/' component={Tool} />
        <Route path='/plugins/:id' component={withTool(Plugins)} />
        <Route exact path='/complete' component={Complete} />
        <Route exact path='/preference' component={withTool(Preference)} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById(styles.app)
);
