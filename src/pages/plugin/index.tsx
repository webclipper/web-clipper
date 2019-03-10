import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router';

import Plugin from './Plugin';
import { pluginRouterCreator } from '../../const';

const useActions = {};

function withPlugin(plugin: ClipperPlugin) {
  return class HOC extends React.Component {
    render() {
      return (
        <React.Fragment>
          <Plugin plugin={plugin} />
        </React.Fragment>
      );
    }
  };
}

const mapStateToProps = ({
  router,
  userPreference: { plugins }
}: GlobalStore) => {
  return {
    plugins: plugins.filter(o => o.type === 'clipper') as ClipperPlugin[],
    router
  };
};
type PageState = {};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {};
type PageProps = PageStateProps & PageDispatchProps & PageOwnProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

class Page extends React.Component<PageProps, PageState> {
  render() {
    return (
      <div>
        {this.props.plugins.map(plugin => (
          <Route
            exact
            path={pluginRouterCreator(plugin.id)}
            key={plugin.id}
            component={withPlugin(plugin)}
          />
        ))}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
