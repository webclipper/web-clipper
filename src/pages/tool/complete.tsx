import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToolContainer } from '../../components/container';
import * as styles from './complete.scss';
import { Button, Switch } from 'antd';
import { emptyFunction } from '../../utils';

const useActions = {
  toggleQRCodeStatus: emptyFunction
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
  render() {
    const { containToken, QRCodeContent } = this.props;
    return (
      <ToolContainer>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>保存成功</h1>
          <a className={styles.menuButton} href={'1'} target="_blank">
            <Button style={{ marginTop: 16 }} size="large" type="primary" block>
              前往语雀查看
            </Button>
          </a>
        </section>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>
            在小程序上查看（请使用微信扫描）
          </h1>
          <img id={styles.qrCodeArea} src={QRCodeContent} />
          <div>
            <span>附带语雀 Token </span>
            <Switch
              onChange={() => {
                this.props.toggleQRCodeStatus();
              }}
            />
            {containToken && (
              <p style={{ paddingTop: '10px' }}>
                扫描后会自动在小程序中登陆，请注意保密。
              </p>
            )}
          </div>
        </section>
      </ToolContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
