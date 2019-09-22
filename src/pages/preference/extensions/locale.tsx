import React from 'react';
import { useSelector, useDispatch, connect } from 'dva';
import { GlobalStore } from '@/common/types';
import { Icon, Row, Col, Typography, Tooltip } from 'antd';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import { setDefaultExtensionId } from '@/actions/extension';
import { FormattedMessage } from 'react-intl';
import ExtensionCard from '@/components/ExtensionCard';
import styles from './index.scss';

const Page: React.FC = () => {
  const { extensions, defaultExtensionId } = useSelector(
    ({ extension: { extensions, defaultExtensionId } }: GlobalStore) => {
      return {
        extensions,
        defaultExtensionId,
      };
    }
  );
  const dispatch = useDispatch();
  const [toolExtensions, clipExtensions] = useFilterExtensions(extensions);
  const handleSetDefault = (extensionId: string) => {
    dispatch(setDefaultExtensionId.started(extensionId));
  };

  return (
    <div>
      <Typography.Title level={3}>
        <FormattedMessage
          id="preference.extensions.toolExtensions"
          defaultMessage="Tool Extensions"
        />
      </Typography.Title>
      <Row gutter={10}>
        {toolExtensions.map(({ manifest, id }) => {
          return (
            <Col key={id} span={12}>
              <ExtensionCard className={styles.extensionCard} manifest={manifest}></ExtensionCard>
            </Col>
          );
        })}
      </Row>
      <Typography.Title level={3}>
        <FormattedMessage
          id="preference.extensions.clipExtensions"
          defaultMessage="Clip Extensions"
        />
        <Tooltip
          title={
            <FormattedMessage
              id="preference.extensions.clipExtensions.tooltip"
              defaultMessage="Click on the 🌟 to choose the default extension."
            />
          }
        >
          <Icon type="question-circle" style={{ fontSize: 14, marginLeft: 5 }} />
        </Tooltip>
      </Typography.Title>
      <Row gutter={10}>
        {clipExtensions.map(({ manifest, id }) => {
          const isDefaultExtension = defaultExtensionId === id;
          const iconStyle = isDefaultExtension ? { color: 'red' } : {};
          const actions = [
            <Icon
              type="star"
              key="star"
              style={iconStyle}
              onClick={() => handleSetDefault(id)}
            ></Icon>,
          ];
          return (
            <Col key={id} span={12}>
              <ExtensionCard
                className={styles.extensionCard}
                manifest={manifest}
                actions={actions}
              ></ExtensionCard>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default connect()(Page);
