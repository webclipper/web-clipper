import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToolContainer } from '../../components/container';
import * as styles from './complete.scss';
import { Button } from 'antd';
import { emptyFunction } from '../../utils';
import { backendServices } from '../../const/index';

const useActions = {
  toggleQRCodeStatus: emptyFunction
};

const mapStateToProps = ({
  clipper: { completeStatus, currentAccountId },
  userPreference: { accounts }
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);

  return {
    currentAccount,
    completeStatus
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
    const { completeStatus, currentAccount } = this.props;
    if (!completeStatus || !currentAccount) {
      return (
        <ToolContainer>
          <a
            target="_blank"
            href="https://github.com/yuquewebclipper/yuque-web-clipper/issues"
          >
            发生错误
          </a>
        </ToolContainer>
      );
    }
    return (
      <ToolContainer>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>保存成功</h1>
          <a
            className={styles.menuButton}
            href={completeStatus.documentHref}
            target="_blank"
          >
            <Button style={{ marginTop: 16 }} size="large" type="primary" block>
              前往 {backendServices[currentAccount.type].name} 查看
            </Button>
          </a>
        </section>
      </ToolContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
