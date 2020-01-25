import * as React from 'react';
import { useSelector } from 'dva';
import { ToolContainer } from 'components/container';
import styles from './complete.less';
import { Button } from 'antd';
import { GlobalStore } from '@/common/types';
import Section from 'components/section';
import { FormattedMessage } from 'react-intl';
import Share from '@/components/share';
import Container from 'typedi';
import { IContentScriptService } from '@/service/common/contentScript';

const Page: React.FC = () => {
  const { servicesMeta, currentAccount, completeStatus, createDocumentRequest } = useSelector(
    ({
      clipper: { completeStatus, currentAccountId, createDocumentRequest },
      userPreference: { servicesMeta },
      account: { accounts },
    }: GlobalStore) => {
      const currentAccount = accounts.find(o => o.id === currentAccountId);
      return {
        servicesMeta,
        currentAccount,
        completeStatus,
        createDocumentRequest,
      };
    }
  );
  function closeTool() {
    Container.get(IContentScriptService).remove();
  }
  const renderError = (
    <ToolContainer onClickCloseButton={closeTool}>
      <a target="_blank" href="https://github.com/webclipper/web-clipper/issues">
        <FormattedMessage id="page.complete.error" defaultMessage="Some Error" />
      </a>
    </ToolContainer>
  );
  if (!currentAccount) {
    return renderError;
  }
  const currentService = servicesMeta[currentAccount.type];
  if (!currentService) {
    return renderError;
  }
  const { name, complete: Complete } = currentService;
  return (
    <ToolContainer onClickCloseButton={closeTool} onClickMask={closeTool}>
      <Section title={<FormattedMessage id="page.complete.success" defaultMessage="Success" />}>
        {completeStatus?.href ? (
          <a href={completeStatus.href} target="_blank">
            <Button className={styles.jump} size="large" type="primary" block>
              <FormattedMessage
                id="page.complete.message"
                defaultMessage="Go to {name}"
                values={{ name: <span>{name}</span> }}
              />
            </Button>
          </a>
        ) : (
          <Button className={styles.jump} size="large" type="primary" block onClick={closeTool}>
            <FormattedMessage id="page.complete.close" defaultMessage="Close Web Clipper" />
          </Button>
        )}
      </Section>
      {Complete && <Complete status={completeStatus}> </Complete>}
      <Section title={<FormattedMessage id="page.complete.share" defaultMessage="Share" />}>
        <Share content={createDocumentRequest!.content}></Share>
      </Section>
    </ToolContainer>
  );
};

export default Page;
