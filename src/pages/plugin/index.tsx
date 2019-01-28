import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CenterContainer } from '../../components/container';
import { Route } from 'react-router';

const useActions = {};

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
      <CenterContainer>
        {this.props.plugins.map(plugin => (
          <Route
            path={plugin.path}
            key={plugin.path}
            component={plugin.component}
          />
        ))}
      </CenterContainer>
    );
  }
}

const Empty = (input?: string) => {
  return () => {
    return <div>{input || 'empty'}</div>;
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);

export const plugins = [
  {
    name: '整个页面',
    icon: 'copy',
    path: '/plugins/fullPage',
    component: Empty('fullPage')
  },
  {
    name: '智能提取',
    icon: 'copy',
    path: '/plugins/readability',
    component: Empty()
  },
  {
    name: '网页链接',
    icon: 'link',
    path: '/plugins/url',
    component: Empty()
  },
  {
    name: '手动选择',
    icon: 'select',
    path: '/plugins/select',
    component: Empty()
  },
  {
    name: '屏幕截图',
    icon: 'picture',
    path: '/plugins/screenShoot',
    component: Empty()
  }
];
