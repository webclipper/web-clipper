import React from 'react';
import { useSelector, useDispatch } from 'dva';
import { GlobalStore } from '@/common/types';
import { Skeleton, Col, Row, Icon, Typography, Tooltip } from 'antd';
import {
  SerializedExtensionInfo,
  getLocaleExtensionManifest,
  SerializedExtension,
  SerializedExtensionWithId,
} from '@web-clipper/extensions';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import { FormattedMessage } from 'react-intl';
import ExtensionCard from '@/components/ExtensionCard';
import styles from './index.less';
import { installRemoteExtension } from '@/actions/extension';
import { hasUpdate } from '@/common/version';
import Container from 'typedi';
import { IConfigService } from '@/service/common/config';
import usePowerpack from '@/common/hooks/usePowerpack';
import { useFetch, useLoading } from '@shihengtech/hooks';
import request from 'umi-request';

interface RemoteExtensionProps {
  host: string;
}

interface DownloadButtonProps {
  manifest: SerializedExtensionInfo;
  localVersion: string;
  host: string;
  extensions: Map<string, SerializedExtensionWithId>;
  havePowerPack: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  manifest,
  localVersion,
  host,
  extensions,
  havePowerPack,
}) => {
  const dispatch = useDispatch();
  const fetchExtension = useLoading((id: string) => request(`${host}/extensions/${id}`), {
    onSuccess: e => {
      const _extension: SerializedExtension = e;
      const extension: SerializedExtensionWithId = {
        ..._extension,
        id: manifest.id,
        router: `/plugins/${manifest.id}`,
        embedded: false,
      };
      dispatch(installRemoteExtension.started(extension));
    },
  });
  if (fetchExtension.loading) {
    return <Icon type="loading" spin={true}></Icon>;
  }
  if (manifest.manifest.powerpack && !havePowerPack) {
    return (
      <Tooltip
        title={
          <FormattedMessage
            id="preference.extensions.require.powerpack"
            defaultMessage="Powerpack is required"
          />
        }
      >
        <Icon style={{ cursor: 'not-allowed' }} type="download" />
      </Tooltip>
    );
  }
  if (manifest.manifest.apiVersion && hasUpdate(manifest.manifest.apiVersion, localVersion)) {
    return (
      <Tooltip
        title={
          <FormattedMessage
            id="preference.extensions.require.update"
            defaultMessage="Should update extension to {name}"
            values={{
              version: manifest.manifest.apiVersion,
            }}
          />
        }
      >
        <Icon style={{ cursor: 'not-allowed' }} type="download" />
      </Tooltip>
    );
  }
  const installedExtension = extensions.get(manifest.id);
  if (installedExtension) {
    if (installedExtension.manifest.version === manifest.manifest.version) {
      return <Icon type="check" />;
    }
    return (
      <Tooltip
        title={<FormattedMessage id="preference.extensions.update" defaultMessage="Update" />}
      >
        <Icon type="sync" onClick={() => fetchExtension.run(manifest.id)} />
      </Tooltip>
    );
  }
  return (
    <Tooltip
      title={<FormattedMessage id="preference.extensions.install" defaultMessage="Install" />}
    >
      <Icon type="download" onClick={() => fetchExtension.run(manifest.id)} />
    </Tooltip>
  );
};

const selector = ({ extension: { extensions }, userPreference: { locale } }: GlobalStore) => {
  const map = new Map<string, SerializedExtensionWithId>();
  extensions.forEach(e => {
    map.set(e.id, e);
  });
  return {
    extensions: map,
    locale,
  };
};

const Page: React.FC<RemoteExtensionProps> = ({ host }) => {
  const { loading, data, error } = useFetch(() => request(`${host}/extensions/index`), [], {
    initialState: {
      data: [],
    },
  });
  const { locale, extensions } = useSelector(selector);
  const { bought, expired } = usePowerpack();
  const configService = Container.get(IConfigService);

  const [remoteToolExtensions, remoteClipExtensions] = useFilterExtensions(data);
  if (loading) {
    return <Skeleton></Skeleton>;
  }
  if (error) {
    return <div>Error</div>;
  }
  const cardActions = (e: SerializedExtensionInfo) => {
    return [
      <DownloadButton
        havePowerPack={bought && !expired}
        manifest={e}
        key="download"
        localVersion={configService.localVersion}
        extensions={extensions}
        host={host}
      />,
    ];
  };

  return (
    <React.Fragment>
      <Typography.Title level={3}>
        <FormattedMessage
          id="preference.extensions.toolExtensions"
          defaultMessage="Tool Extensions"
        />
      </Typography.Title>
      <Row gutter={10}>
        {remoteToolExtensions.map(e => (
          <Col key={e.id} span={12}>
            <ExtensionCard
              className={styles.extensionCard}
              manifest={getLocaleExtensionManifest(e.manifest, locale)}
              actions={cardActions(e)}
            />
          </Col>
        ))}
      </Row>
      <Typography.Title level={3}>
        <FormattedMessage
          id="preference.extensions.clipExtensions"
          defaultMessage="Clip Extensions"
        />
      </Typography.Title>
      <Row gutter={10}>
        {remoteClipExtensions.map(e => (
          <Col key={e.id} span={12}>
            <ExtensionCard
              className={styles.extensionCard}
              manifest={getLocaleExtensionManifest(e.manifest, locale)}
              actions={cardActions(e)}
            />
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default Page;
