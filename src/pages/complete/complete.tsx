import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'dva';
import { ToolContainer } from 'components/container';
import * as styles from './complete.scss';
import { Button } from 'antd';
import { asyncRemoveTool } from 'pageActions/userPreference';
import { GlobalStore } from '../../store/reducers/interface';
import Section from 'components/section';

const useActions = {
  asyncRemoveTool: asyncRemoveTool.started,
};

const mapStateToProps = ({
  clipper: { completeStatus, currentAccountId },
  userPreference: { accounts, servicesMeta },
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);
  return {
    servicesMeta,
    currentAccount,
    completeStatus,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageProps = PageStateProps & PageDispatchProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(useActions, dispatch);

const Page: React.FC<PageProps> = props => {
  function closeTool() {
    props.asyncRemoveTool();
  }
  const renderError = (
    <ToolContainer onClickCloseButton={closeTool}>
      <a target="_blank" href="https://github.com/webclipper/web-clipper/issues">
        发生错误
      </a>
    </ToolContainer>
  );
  const { completeStatus, currentAccount, servicesMeta } = props;
  if (!completeStatus || !currentAccount) {
    return renderError;
  }
  const currentService = servicesMeta[currentAccount.type];
  if (!currentService) {
    return renderError;
  }
  const { name, complete: Complete } = currentService;
  return (
    <ToolContainer onClickCloseButton={closeTool}>
      <Section title="保存成功">
        <a className={styles.menuButton} href={completeStatus.href} target="_blank">
          <Button style={{ marginTop: 16 }} size="large" type="primary" block>
            前往<span>{name}</span> 查看
          </Button>
        </a>
      </Section>
      {Complete && <Complete status={completeStatus}> </Complete>}
    </ToolContainer>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
