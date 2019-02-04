import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CenterContainer } from '../../components/container';
import * as styles from './index.scss';
import { Tabs, List, Switch, Select } from 'antd';
import { push } from 'connected-react-router';
import UserList from './userList/index';
import {
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber
} from '../../store/actions/userPreference';
const TabPane = Tabs.TabPane;

const useActions = {
  push: push,
  asyncSetEditorLiveRendering: asyncSetEditorLiveRendering.started,
  asyncSetShowLineNumber: asyncSetShowLineNumber.started
};

const mapStateToProps = ({
  userPreference: { accounts, liveRendering, showLineNumber }
}: GlobalStore) => {
  return {
    showLineNumber,
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
  onchange = (e: any) => {
    console.log(e);
  };

  render() {
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
              defaultActiveKey="base"
              tabPosition="left"
              style={{ height: '100%' }}
            >
              <TabPane tab="基本设置" key="base">
                <UserList />
              </TabPane>
              <TabPane tab="工具设置" key="tool">
                <div style={{ padding: '40px' }}>
                  <List.Item actions={[<Switch key="we" />]}>
                    <List.Item.Meta
                      title="隐藏二维码"
                      description="剪藏完成后是否显示二维码"
                    />
                  </List.Item>
                  <List.Item
                    actions={[
                      <Select
                        key="selectDefaultPlugin"
                        style={{ width: '100px' }}
                      >
                        <Select.Option key="undifined">无</Select.Option>
                      </Select>
                    ]}
                  >
                    <List.Item.Meta
                      title="默认插件"
                      description="开启剪藏后使用的默认插件"
                    />
                  </List.Item>
                </div>
              </TabPane>
              <TabPane tab="编辑器设置" key="editor">
                <div style={{ padding: '40px' }}>
                  <List.Item
                    actions={[
                      <Switch
                        checked={this.props.showLineNumber}
                        onChange={() => {
                          this.props.asyncSetShowLineNumber({
                            value: this.props.showLineNumber
                          });
                        }}
                        key="showLineNumber"
                      />
                    ]}
                  >
                    <List.Item.Meta
                      title="显示行号"
                      description="显示编辑器右侧的行号"
                    />
                  </List.Item>
                  <List.Item
                    actions={[
                      <Switch
                        key="liveRendering"
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
                      title="实时预览"
                      description="是否开启实时预览"
                    />
                  </List.Item>
                </div>
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
