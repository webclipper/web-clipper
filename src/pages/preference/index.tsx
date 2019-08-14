import * as React from 'react';
import * as styles from './index.scss';
import UserList from './userList';
import ImageHosting from './imageHosting';
import Extensions from './extensions';
import {
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber,
  setLocale,
  asyncSetLocaleToStorage,
} from 'pageActions/userPreference';
import { bindActionCreators, Dispatch } from 'redux';
import { CenterContainer } from 'components/container';
import { connect, routerRedux, router } from 'dva';
import { List, Switch, Tabs, Icon, Select } from 'antd';
import { GlobalStore } from '@/common/types';
import { FormattedMessage } from 'react-intl';

const { withRouter } = router;
const ExtensionsWithRouter = withRouter(Extensions);

const TabPane = Tabs.TabPane;

const useActions = {
  push: routerRedux.push,
  asyncSetEditorLiveRendering: asyncSetEditorLiveRendering.started,
  asyncSetShowLineNumber: asyncSetShowLineNumber.started,
  asyncSetLocaleToStorage: asyncSetLocaleToStorage,
  setLocale: setLocale,
};

const mapStateToProps = ({
  userPreference: { accounts, liveRendering, showLineNumber, locale },
}: GlobalStore) => {
  return {
    showLineNumber,
    liveRendering,
    accounts,
    locale,
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
            <Tabs defaultActiveKey="account" tabPosition="left" style={{ height: '100%' }}>
              <TabPane
                tab={
                  <FormattedMessage
                    id="preference.tab.account"
                    defaultMessage="Account"
                  ></FormattedMessage>
                }
                key="account"
                className={styles.tabPane}
              >
                <UserList />
              </TabPane>
              <TabPane
                tab={
                  <FormattedMessage
                    id="preference.tab.extensions"
                    defaultMessage="Extension"
                  ></FormattedMessage>
                }
                key="extensions"
                className={styles.tabPane}
              >
                <ExtensionsWithRouter />
              </TabPane>
              <TabPane
                tab={
                  <FormattedMessage
                    id="preference.tab.imageHost"
                    defaultMessage="ImageHost"
                  ></FormattedMessage>
                }
                key="imageHost"
                className={styles.tabPane}
              >
                <ImageHosting />
              </TabPane>
              <TabPane
                tab={
                  <FormattedMessage
                    id="preference.tab.basic"
                    defaultMessage="Basic"
                  ></FormattedMessage>
                }
                key="basic"
                className={styles.tabPane}
              >
                <List.Item
                  actions={[
                    <Select
                      key="configLanguage"
                      value={this.props.locale}
                      onChange={(e: string) => this.props.asyncSetLocaleToStorage(e)}
                    >
                      <Select.Option key="zh-CN">中文</Select.Option>
                      <Select.Option key="en-US">English</Select.Option>
                    </Select>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <FormattedMessage
                        id="preference.basic.configLanguage.title"
                        defaultMessage="Language"
                      ></FormattedMessage>
                    }
                    description={
                      <FormattedMessage
                        id="preference.basic.configLanguage.description"
                        defaultMessage="Config Language"
                      ></FormattedMessage>
                    }
                  />
                </List.Item>
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
                  <List.Item.Meta
                    title={
                      <FormattedMessage
                        id="preference.basic.showLineNumber.title"
                        defaultMessage="Show LineNumber"
                      ></FormattedMessage>
                    }
                    description={
                      <FormattedMessage
                        id="preference.basic.showLineNumber.description"
                        defaultMessage="Enable Show LineNumber"
                      ></FormattedMessage>
                    }
                  />
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
                  <List.Item.Meta
                    title={
                      <FormattedMessage
                        id="preference.basic.liveRendering.title"
                        defaultMessage="LiveRendering"
                      ></FormattedMessage>
                    }
                    description={
                      <FormattedMessage
                        id="preference.basic.liveRendering.description"
                        defaultMessage="Enable LiveRendering"
                      ></FormattedMessage>
                    }
                  />
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
