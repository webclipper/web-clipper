import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import {
  getFullPagePlugin,
  getSelectItemPlugin,
  getReadabilityPlugin,
  bookmarkPlugin
} from '../../plugin/index';
import Plugin from './Plugin';

const useActions = {};

export const plugins: ClipperPluginWithRouter[] = [
  getFullPagePlugin,
  getReadabilityPlugin,
  bookmarkPlugin,
  getSelectItemPlugin
].map(plugin => ({
  ...plugin,
  router: `/plugins/${plugin.id}`
}));

function withPlugin(plugin: ClipperPluginWithRouter) {
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

const mapStateToProps = ({ router }: GlobalStore) => {
  return {
    plugins,
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
            path={plugin.router}
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
