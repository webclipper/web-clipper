import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToolContainer } from '../../components/container';
import * as styles from './complete.scss';
import { Button } from 'antd';
import { asyncRemoveTool } from '../../store/actions';
import { QuickResponseCode } from './quickResponseCode';

const useActions = {
  asyncRemoveTool: asyncRemoveTool.started,
};

const mapStateToProps = ({
  clipper: { completeStatus, currentAccountId },
  userPreference: { accounts, showQuickResponseCode, servicesMeta },
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);
  return {
    servicesMeta,
    currentAccount,
    completeStatus,
    showQuickResponseCode,
  };
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {};
type PageProps = PageStateProps & PageDispatchProps & PageOwnProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

class Page extends React.Component<PageProps> {
  render() {
    const {
      completeStatus,
      currentAccount,
      showQuickResponseCode,
      servicesMeta,
    } = this.props;

    if (!completeStatus || !currentAccount) {
      return (
        <ToolContainer
          onClickCloseButton={() => {
            this.props.asyncRemoveTool();
          }}
        >
          <a
            target="_blank"
            href="https://github.com/yuquewebclipper/yuque-web-clipper/issues"
          >
            发生错误
          </a>
        </ToolContainer>
      );
    }

    const currentService = servicesMeta[currentAccount.type];
    const serviceName = currentService && currentService.name;

    return (
      <ToolContainer
        onClickCloseButton={() => {
          this.props.asyncRemoveTool();
        }}
      >
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>保存成功</h1>
          <a
            className={styles.menuButton}
            href={completeStatus.documentHref}
            target="_blank"
          >
            <Button style={{ marginTop: 16 }} size="large" type="primary" block>
              前往<span>{serviceName}</span> 查看
            </Button>
          </a>
        </section>
        {showQuickResponseCode && currentAccount.type === 'yuque' && (
          <section className={styles.section}>
            <h1 className={styles.sectionTitle}>小程序二维码</h1>
            <QuickResponseCode
              repositoryId={completeStatus.repositoryId}
              documentId={completeStatus.documentId}
              accessToken={currentAccount.accessToken}
            />
          </section>
        )}
      </ToolContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
