import * as React from 'react';
import * as styles from './index.scss';
import UserList from './userList/index';
import {
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber,
  asyncSetShowQuickResponseCode,
  asyncSetDefaultPluginId
} from '../../store/actions/userPreference';
import { bindActionCreators, Dispatch } from 'redux';
import { CenterContainer } from '../../components/container';
import { connect } from 'react-redux';
import { List, Select, Switch, Tabs } from 'antd';
import { push } from 'connected-react-router';
import { plugins } from '../plugin/index';
const TabPane = Tabs.TabPane;

const useActions = {
  push: push,
  asyncSetEditorLiveRendering: asyncSetEditorLiveRendering.started,
  asyncSetShowLineNumber: asyncSetShowLineNumber.started,
  asyncSetShowQuickResponseCode: asyncSetShowQuickResponseCode.started,
  asyncSetDefaultPluginId: asyncSetDefaultPluginId.started
};

const mapStateToProps = ({
  userPreference: {
    accounts,
    liveRendering,
    showLineNumber,
    showQuickResponseCode,
    defaultPluginId
  }
}: GlobalStore) => {
  return {
    showLineNumber,
    showQuickResponseCode,
    defaultPluginId,
    closeQRCode: true,
    containToken: true,
    liveRendering,
    QRCodeContent: '',
    accounts
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
    const { defaultPluginId } = this.props;
    return (
      <CenterContainer>
        <div className={styles.mainContent}>
          <div
            onClick={() => {
              this.props.push('/');
            }}
            className={styles.closeIcon}
          >
            关闭
          </div>
          <div style={{ background: 'white', height: '100%' }}>
            <Tabs
              defaultActiveKey='base'
              tabPosition='left'
              style={{ height: '100%' }}
            >
              <TabPane tab='账户设置' key='base' className={styles.tabPane}>
                <UserList />
              </TabPane>
              <TabPane tab='工具设置' key='tool' className={styles.tabPane}>
                <List.Item
                  actions={[
                    <Switch
                      key='qrcode'
                      onChange={() => {
                        this.props.asyncSetShowQuickResponseCode({
                          value: this.props.showQuickResponseCode
                        });
                      }}
                    />
                  ]}
                >
                  <List.Item.Meta
                    title='小程序二维码'
                    description='剪藏完成后是否显示小程序二维码'
                  />
                </List.Item>
                <List.Item
                  actions={[
                    <Select
                      key='selectDefaultPlugin'
                      allowClear
                      value={defaultPluginId ? defaultPluginId : -1}
                      style={{ width: '100px' }}
                      onSelect={(value: string | -1) => {
                        let selectValue = null;
                        if (value !== -1) {
                          selectValue = value;
                        }
                        this.props.asyncSetDefaultPluginId({
                          pluginId: selectValue
                        });
                      }}
                    >
                      <Select.Option value={-1}>无</Select.Option>
                      {plugins.map(o => (
                        <Select.Option key={o.id}>{o.name}</Select.Option>
                      ))}
                    </Select>
                  ]}
                >
                  <List.Item.Meta
                    title='默认插件'
                    description='开启剪藏后使用的默认插件'
                  />
                </List.Item>
              </TabPane>
              <TabPane tab='编辑器设置' key='editor' className={styles.tabPane}>
                <List.Item
                  actions={[
                    <Switch
                      checked={this.props.showLineNumber}
                      onChange={() => {
                        this.props.asyncSetShowLineNumber({
                          value: this.props.showLineNumber
                        });
                      }}
                      key='showLineNumber'
                    />
                  ]}
                >
                  <List.Item.Meta
                    title='显示行号'
                    description='显示编辑器右侧的行号'
                  />
                </List.Item>
                <List.Item
                  actions={[
                    <Switch
                      key='liveRendering'
                      checked={this.props.liveRendering}
                      onChange={() => {
                        this.props.asyncSetEditorLiveRendering({
                          value: this.props.liveRendering
                        });
                      }}
                    />
                  ]}
                >
                  <List.Item.Meta
                    title='实时预览'
                    description='是否开启实时预览'
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
)(Page as React.ComponentType<PageProps>);
