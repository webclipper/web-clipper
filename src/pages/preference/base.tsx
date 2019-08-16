import React from 'react';
import { GlobalStore, DvaRouterProps } from '@/common/types';
import { connect } from 'dva';
import { List, Select, Switch } from 'antd';
import {
  asyncSetLocaleToStorage,
  asyncSetShowLineNumber,
  asyncSetEditorLiveRendering,
} from '@/actions/userPreference';
import { FormattedMessage } from 'react-intl';

const mapStateToProps = ({
  userPreference: { locale, showLineNumber, liveRendering },
  version: { localVersion, remoteVersion, hasUpdate },
}: GlobalStore) => {
  return {
    localVersion,
    remoteVersion,
    hasUpdate,
    locale,
    showLineNumber,
    liveRendering,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;

interface BaseProps {}

type PageProps = BaseProps & PageStateProps & DvaRouterProps;

const Base: React.FC<PageProps> = props => {
  const { dispatch } = props;
  return (
    <React.Fragment>
      <List.Item
        actions={[
          <Select
            key="configLanguage"
            value={props.locale}
            onChange={(e: string) => dispatch(asyncSetLocaleToStorage(e))}
          >
            <Select.Option key="zh-CN">中文</Select.Option>
            <Select.Option key="en-US">English</Select.Option>
          </Select>,
        ]}
      >
        <List.Item.Meta
          title={
            <FormattedMessage
              id="preference.basic.configLanguage.title"
              defaultMessage="Language"
            ></FormattedMessage>
          }
          description={
            <FormattedMessage
              id="preference.basic.configLanguage.description"
              defaultMessage="Config Language"
            ></FormattedMessage>
          }
        />
      </List.Item>
      <List.Item
        actions={[
          <Switch
            checked={props.showLineNumber}
            onChange={() => {
              dispatch(
                asyncSetShowLineNumber.started({
                  value: props.showLineNumber,
                })
              );
            }}
            key="showLineNumber"
          />,
        ]}
      >
        <List.Item.Meta
          title={
            <FormattedMessage
              id="preference.basic.showLineNumber.title"
              defaultMessage="Show LineNumber"
            ></FormattedMessage>
          }
          description={
            <FormattedMessage
              id="preference.basic.showLineNumber.description"
              defaultMessage="Enable Show LineNumber"
            ></FormattedMessage>
          }
        />
      </List.Item>
      <List.Item
        actions={[
          <Switch
            key="liveRendering"
            checked={props.liveRendering}
            onChange={() => {
              asyncSetEditorLiveRendering.started({
                value: props.liveRendering,
              });
            }}
          />,
        ]}
      >
        <List.Item.Meta
          title={
            <FormattedMessage
              id="preference.basic.liveRendering.title"
              defaultMessage="LiveRendering"
            ></FormattedMessage>
          }
          description={
            <FormattedMessage
              id="preference.basic.liveRendering.description"
              defaultMessage="Enable LiveRendering"
            ></FormattedMessage>
          }
        />
      </List.Item>
      {props.hasUpdate && (
        <List.Item
          actions={[
            <a key="w" href="https://github.com/webclipper/web-clipper/releases" target="_blank">
              <FormattedMessage
                id="preference.basic.update.button"
                defaultMessage="Install Update"
              />
            </a>,
          ]}
        >
          <List.Item.Meta
            title={
              <FormattedMessage
                id="preference.basic.update.title"
                defaultMessage="Has Update"
              ></FormattedMessage>
            }
          />
        </List.Item>
      )}
    </React.Fragment>
  );
};

export default connect(mapStateToProps)(Base as React.FC<PageProps>) as any;
