import React from 'react';
import { useSelector, useDispatch } from 'dva';
import { GlobalStore } from '@/common/types';
import { Icon, Row, Col, Typography, Tooltip, Empty, Switch } from 'antd';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import {
  setDefaultExtensionId,
  toggleDisableExtension,
  unInstallRemoteExtension,
  toggleAutomaticExtension,
} from '@/actions/extension';
import { FormattedMessage } from 'react-intl';
import ExtensionCard from '@/components/ExtensionCard';
import styles from './index.scss';
import { SerializedExtensionWithId, ExtensionType } from '@web-clipper/extensions';
import IconFont from '@/components/IconFont';

const selector = ({
  extension: { extensions, defaultExtensionId, disabledExtensions, disabledAutomaticExtensions },
}: GlobalStore) => {
  return {
    extensions,
    defaultExtensionId,
    disabledExtensions,
    disabledAutomaticExtensions,
  };
};

const Page: React.FC = () => {
  const dispatch = useDispatch();
  const {
    extensions,
    defaultExtensionId,
    disabledExtensions,
    disabledAutomaticExtensions,
  } = useSelector(selector);
  const [toolExtensions, clipExtensions] = useFilterExtensions(extensions);
  const handleSetDefault = (extensionId: string) => {
    dispatch(setDefaultExtensionId.started(extensionId));
  };
  const UninstallButton: React.FC<{ extension: SerializedExtensionWithId }> = ({
    extension: { id, embedded },
  }) => {
    if (embedded) {
      return null;
    }
    let handleClick = () => dispatch(unInstallRemoteExtension(id));
    const title = (
      <FormattedMessage id="preference.extensions.Uninstall" defaultMessage="Uninstall" />
    );
    return (
      <Tooltip title={title}>
        <Icon type="delete" onClick={handleClick} />{' '}
      </Tooltip>
    );
  };

  const cardActions = (e: SerializedExtensionWithId) => {
    const actions = [];
    if (!e.embedded) {
      actions.push(<UninstallButton extension={e} key="uninstall" />);
    }

    if (e.type !== ExtensionType.Tool) {
      const isDefaultExtension = defaultExtensionId === e.id;
      const iconStyle = isDefaultExtension ? { color: 'red' } : {};
      const title = isDefaultExtension ? (
        <FormattedMessage
          id="preference.extensions.CancelSetting"
          defaultMessage="Cancel Setting"
        />
      ) : (
        <FormattedMessage
          id="preference.extensions.ConfiguredAsDefaultExtension"
          defaultMessage="Configured as default extension"
        />
      );
      actions.push(
        <Tooltip title={title}>
          <Icon type="star" key="star" style={iconStyle} onClick={() => handleSetDefault(e.id)} />
        </Tooltip>
      );
    }
    if (e.manifest.automatic) {
      actions.push(
        <IconFont
          type="auto"
          onClick={() => dispatch(toggleAutomaticExtension(e.id))}
          style={!disabledAutomaticExtensions.some(o => o === e.id) ? { color: 'red' } : {}}
        />
      );
    }
    return actions.concat(
      <Switch
        size="small"
        checked={!disabledExtensions.some(o => o === e.id)}
        onClick={() => dispatch(toggleDisableExtension(e.id))}
      ></Switch>
    );
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
        {toolExtensions.length === 0 && <Empty></Empty>}
        {toolExtensions.map(e => (
          <Col key={e.id} span={12}>
            <ExtensionCard
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

export default Page;
