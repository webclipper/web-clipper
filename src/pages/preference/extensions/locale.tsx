import React from 'react';
import { useSelector, useDispatch, connect } from 'dva';
import { GlobalStore } from '@/common/types';
import { Icon, Row, Col, Typography, Tooltip } from 'antd';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import { setDefaultExtensionId, toggleDisableExtension } from '@/actions/extension';
import { FormattedMessage } from 'react-intl';
import ExtensionCard from '@/components/ExtensionCard';
import styles from './index.scss';
import { SerializedExtensionWithId } from '@web-clipper/extensions';

const Page: React.FC = () => {
  const { extensions, defaultExtensionId, disabledExtensions } = useSelector(
    ({ extension: { extensions, defaultExtensionId, disabledExtensions } }: GlobalStore) => {
      return {
        extensions,
        disabledExtensions: disabledExtensions,
        defaultExtensionId,
      };
    }
  );
  const dispatch = useDispatch();
  const [toolExtensions, clipExtensions] = useFilterExtensions(extensions);
  const handleSetDefault = (extensionId: string) => {
    dispatch(setDefaultExtensionId.started(extensionId));
  };

  const DisableButton: React.FC<{ extension: SerializedExtensionWithId }> = ({
    extension: { id },
  }) => {
    const disabled = disabledExtensions.some(o => o === id);
    let handleClick = () => dispatch(toggleDisableExtension(id));
    const iconStyle = disabled ? { color: 'red' } : {};
    return <Icon type="close-circle" style={iconStyle} onClick={handleClick} />;
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
        {toolExtensions.map(e => {
          return (
            <Col key={e.id} span={12}>
              <ExtensionCard
                className={styles.extensionCard}
                manifest={e.manifest}
                actions={[<DisableButton extension={e} key="disable" />]}
              />
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
        {clipExtensions.map(e => {
          const { manifest, id } = e;
          const isDefaultExtension = defaultExtensionId === id;
          const iconStyle = isDefaultExtension ? { color: 'red' } : {};
          const actions = [
            <DisableButton extension={e} key="disable" />,
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
