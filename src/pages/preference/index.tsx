import * as React from 'react';
import * as styles from './index.scss';
import UserList from './userList';
import ImageHosting from './imageHosting';
import Extensions from './extensions';
import { asyncSetEditorLiveRendering, asyncSetShowLineNumber } from 'pageActions/userPreference';
import { bindActionCreators, Dispatch } from 'redux';
import { CenterContainer } from 'components/container';
import { connect, routerRedux, router } from 'dva';
import { List, Switch, Tabs, Icon } from 'antd';
import { GlobalStore } from '@/common/types';

const { withRouter } = router;
const ExtensionsWithRouter = withRouter(Extensions);

const TabPane = Tabs.TabPane;

const useActions = {
  push: routerRedux.push,
  asyncSetEditorLiveRendering: asyncSetEditorLiveRendering.started,
  asyncSetShowLineNumber: asyncSetShowLineNumber.started,
};

const mapStateToProps = ({
  userPreference: { accounts, liveRendering, showLineNumber },
}: GlobalStore) => {
  return {
    showLineNumber,
    liveRendering,
    accounts,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageProps = PageStateProps & PageDispatchProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(useActions, dispatch);

class Page extends React.Component<PageProps> {
  handleClose = () => {
    this.props.push('/');
  };

  render() {
    return (
      <CenterContainer>
        <div className={styles.mainContent}>
          <div onClick={this.handleClose} className={styles.closeIcon}>
            <Icon type="close" />
          </div>
          <div style={{ background: 'white', height: '100%' }}>
            <Tabs defaultActiveKey="userList" tabPosition="left" style={{ height: '100%' }}>
              <TabPane tab="插件设置" key="extensions" className={styles.tabPane}>
                <ExtensionsWithRouter />
              </TabPane>
              <TabPane tab="账户设置" key="userList" className={styles.tabPane}>
                <UserList />
              </TabPane>
              <TabPane tab="图床设置" key="imageHost" className={styles.tabPane}>
                <ImageHosting />
              </TabPane>
              <TabPane tab="编辑器设置" key="editor" className={styles.tabPane}>
                <List.Item
                  actions={[
                    <Switch
                      checked={this.props.showLineNumber}
                      onChange={() => {
                        this.props.asyncSetShowLineNumber({
                          value: this.props.showLineNumber,
                        });
                      }}
                      key="showLineNumber"
                    />,
                  ]}
                >
                  <List.Item.Meta title="显示行号" description="显示编辑器右侧的行号" />
                </List.Item>
                <List.Item
                  actions={[
                    <Switch
                      key="liveRendering"
                      checked={this.props.liveRendering}
                      onChange={() => {
                        this.props.asyncSetEditorLiveRendering({
                          value: this.props.liveRendering,
                        });
                      }}
                    />,
                  ]}
                >
                  <List.Item.Meta title="实时预览" description="是否开启实时预览" />
                </List.Item>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </CenterContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
