import React from 'react';
import { useSelector, useDispatch, connect } from 'dva';
import { GlobalStore } from '@/common/types';
import { Icon, Row, Col, Typography, Tooltip } from 'antd';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import {
  setDefaultExtensionId,
  toggleDisableExtension,
  unInstallRemoteExtension,
} from '@/actions/extension';
import { FormattedMessage } from 'react-intl';
import ExtensionCard from '@/components/ExtensionCard';
import styles from './index.scss';
import { SerializedExtensionWithId, ExtensionType } from '@web-clipper/extensions';

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
    return <a onClick={handleClick}>{disabled ? 'Enable' : 'Disable'}</a>;
  };

  const UninstallButton: React.FC<{ extension: SerializedExtensionWithId }> = ({
    extension: { id, embedded },
  }) => {
    if (embedded) {
      return null;
    }
    let handleClick = () => dispatch(unInstallRemoteExtension(id));
    return <Icon type="delete" onClick={handleClick} />;
  };

  const cardActions = (e: SerializedExtensionWithId) => {
    const actions = [];

    if (!e.embedded) {
      actions.push(<UninstallButton extension={e} key="uninstall"></UninstallButton>);
    }

    if (e.type !== ExtensionType.Tool) {
      const isDefaultExtension = defaultExtensionId === e.id;
      const iconStyle = isDefaultExtension ? { color: 'red' } : {};
      actions.push(
        <Icon type="star" key="star" style={iconStyle} onClick={() => handleSetDefault(e.id)} />
      );
    }
    return actions;
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
        {toolExtensions.map(e => (
          <Col key={e.id} span={12}>
            <ExtensionCard
              extra={<DisableButton extension={e}></DisableButton>}
              className={styles.extensionCard}
              manifest={e.manifest}
              actions={cardActions(e)}
            ></ExtensionCard>
          </Col>
        ))}
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
        {clipExtensions.map(e => (
          <Col key={e.id} span={12}>
            <ExtensionCard
              extra={<DisableButton extension={e}></DisableButton>}
              className={styles.extensionCard}
              manifest={e.manifest}
              actions={cardActions(e)}
            ></ExtensionCard>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default connect()(Page);
