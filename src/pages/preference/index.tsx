import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CenterContainer } from '../../components/container';
import * as styles from './index.scss';
import { Tabs } from 'antd';
import InitializeForm from './initializeForm';
import { push } from 'connected-react-router';
const TabPane = Tabs.TabPane;

const useActions = {
  push: push
};

const mapStateToProps = (store: GlobalStore) => {
  return {
    closeQRCode: true,
    containToken: true,
    QRCodeContent: '',
    store
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
              defaultActiveKey="1"
              tabPosition="left"
              style={{ height: '100%' }}
            >
              <TabPane tab="基本设置" key="1">
                <div style={{ padding: '40px' }}>{<InitializeForm />}</div>
              </TabPane>
              <TabPane tab="插件设置" key="2" />
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
