import * as React from 'react';
import { connect } from 'dva';
import { ToolContainer } from 'components/container';
import * as styles from './complete.scss';
import { Button } from 'antd';
import { GlobalStore, DvaRouterProps } from '@/common/types';
import Section from 'components/section';
import { asyncRemoveTool } from '@/actions/userPreference';
import { FormattedMessage } from 'react-intl';

const mapStateToProps = ({
  clipper: { completeStatus, currentAccountId },
  userPreference: { servicesMeta },
  account: { accounts },
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);
  return {
    servicesMeta,
    currentAccount,
    completeStatus,
  };
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & DvaRouterProps;

const Page: React.FC<PageProps> = ({ dispatch, completeStatus, currentAccount, servicesMeta }) => {
  function closeTool() {
    dispatch(asyncRemoveTool.started());
  }
  const renderError = (
    <ToolContainer onClickCloseButton={closeTool}>
      <a target="_blank" href="https://github.com/webclipper/web-clipper/issues">
        <FormattedMessage id="page.complete.error" defaultMessage="Some Error" />
      </a>
    </ToolContainer>
  );
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
      <Section title={<FormattedMessage id="page.complete.success" defaultMessage="Success" />}>
        <a className={styles.menuButton} href={completeStatus.href} target="_blank">
          <Button style={{ marginTop: 16 }} size="large" type="primary" block>
            <FormattedMessage
              id="page.complete.message"
              defaultMessage="Go to {name}"
              values={{ name: <span>{name}</span> }}
            />
          </Button>
        </a>
      </Section>
      {Complete && <Complete status={completeStatus}> </Complete>}
    </ToolContainer>
  );
};

export default connect(mapStateToProps)(Page);
