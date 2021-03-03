import React from 'react';
import { QuestionCircleOutlined, StarOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Tooltip, Empty, Switch } from 'antd';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import { FormattedMessage } from 'react-intl';
import ExtensionCard from '@/components/ExtensionCard';
import styles from './index.less';
import { ExtensionType } from '@web-clipper/extensions';
import IconFont from '@/components/IconFont';
import Container from 'typedi';
import { IExtensionService, IExtensionContainer } from '@/service/common/extension';
import { useObserver } from 'mobx-react';
import { IExtensionWithId } from '@/extensions/common';

const Page: React.FC = () => {
  const extensionService = Container.get(IExtensionService);
  const extensionContainer = Container.get(IExtensionContainer);
  const {
    disabledExtensions,
    disabledAutomaticExtensions,
    defaultExtensionId,
    extensions,
    contextMenus,
  } = useObserver(() => {
    return {
      defaultExtensionId: extensionService.DefaultExtensionId,
      disabledAutomaticExtensions: extensionService.DisabledAutomaticExtensionIds,
      disabledExtensions: extensionService.DisabledExtensionIds,
      extensions: extensionContainer.extensions,
      contextMenus: extensionContainer.contextMenus,
    };
  });
  const [toolExtensions, clipExtensions] = useFilterExtensions(extensions);
  const handleSetDefault = (extensionId: string) => {
    extensionService.toggleDefault(extensionId);
  };
  const cardActions = (e: IExtensionWithId) => {
    const actions = [];
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
          <StarOutlined style={iconStyle} onClick={() => handleSetDefault(e.id)} />
        </Tooltip>
      );
    }
    if (e.manifest.automatic) {
      const automaticDisabled = disabledAutomaticExtensions.some(o => o === e.id);
      actions.push(
        <Tooltip
          title={
            automaticDisabled ? (
              <FormattedMessage
                id="preference.extensions.automaticOperationIsProhibited"
                defaultMessage="Automatic operation is prohibited"
              />
            ) : (
              <FormattedMessage
                id="preference.extensions.runAutomaticOnSaving"
                defaultMessage="Run Automatic On Saving"
              />
            )
          }
        >
          <IconFont
            type="auto"
            onClick={() => extensionService.toggleAutomaticExtension(e.id)}
            style={automaticDisabled ? {} : { color: 'red' }}
          />
        </Tooltip>
      );
    }
    return actions.concat(
      <Switch
        size="small"
        checked={!disabledExtensions.some(o => o === e.id)}
        onClick={() => extensionService.toggleDisableExtension(e.id)}
      />
    );
  };

  return (
    <div>
      <Typography.Title level={3}>
        <FormattedMessage id="preference.extensions.contextMenus" />
      </Typography.Title>
      <Row gutter={10}>
        {contextMenus.length === 0 && <Empty></Empty>}
        {contextMenus.map(e => {
          const Factory = e.contextMenu;
          const contextMenus = new Factory();
          return (
            <Col key={e.id} span={12}>
              <ExtensionCard
                className={styles.extensionCard}
                manifest={contextMenus.manifest}
                actions={[
                  <Switch
                    key="toggle"
                    size="small"
                    checked={!disabledExtensions.some(o => o === e.id)}
                    onClick={() => extensionService.toggleDisableExtension(e.id)}
                  />,
                ]}
              ></ExtensionCard>
            </Col>
          );
        })}
      </Row>
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
          <QuestionCircleOutlined style={{ fontSize: 14, marginLeft: 5 }} />
        </Tooltip>
      </Typography.Title>
      <Row gutter={8}>
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
