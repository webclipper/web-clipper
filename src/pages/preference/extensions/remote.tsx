import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { GlobalStore } from '@/common/types';
import Axios from 'axios';
import useAsync from '@/common/hooks/useAsync';
import { Skeleton, Col, Row, Icon, Typography } from 'antd';
import {
  SerializedExtensionInfo,
  getLocaleExtensionManifest,
  SerializedExtension,
  SerializedExtensionWithId,
} from '@web-clipper/extensions';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import { FormattedMessage } from 'react-intl';
import ExtensionCard from '@/components/ExtensionCard';
import styles from './index.scss';
import { installRemoteExtension } from '@/actions/extension';

interface RemoteExtensionProps {
  host: string;
}

const Page: React.FC<RemoteExtensionProps> = ({ host }) => {
  const { loading, result, error } = useAsync(() => Axios(`${host}/extensions/index`));
  const { locale, extensions } = useSelector(
    ({ extension: { extensions }, userPreference: { locale } }: GlobalStore) => {
      const map = new Map<string, SerializedExtensionWithId>();
      extensions.forEach(e => {
        map.set(e.id, e);
      });
      return {
        extensions: map,
        locale,
      };
    }
  );
  const remoteExtensions = useMemo<SerializedExtensionInfo[]>(() => {
    if (!result || !result.data) {
      return [];
    }
    return result.data;
  }, [result]);

  const [remoteToolExtensions, remoteClipExtensions] = useFilterExtensions(remoteExtensions);

  if (loading) {
    return <Skeleton></Skeleton>;
  }
  if (error) {
    return <div>Error</div>;
  }

  const DownloadButton: React.FC<{ manifest: SerializedExtensionInfo }> = ({ manifest }) => {
    const dispatch = useDispatch();
    const fetchExtension = useAsync((id: string) => Axios(`${host}/extensions/${id}`), [], {
      manual: true,
      onSuccess: e => {
        const _extension: SerializedExtension = e.data;
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
    const installedExtension = extensions.get(manifest.id);
    if (installedExtension) {
      if (installedExtension.manifest.version === manifest.manifest.version) {
        return <Icon type="check" />;
      }
      return <Icon type="sync" onClick={() => fetchExtension.run(manifest.id)} />;
    }
    return <Icon type="download" onClick={() => fetchExtension.run(manifest.id)} />;
  };

  const cardActions = (e: SerializedExtensionInfo) => {
    return [<DownloadButton manifest={e} key="download" />];
  };

  return (
    <React.Fragment>
      <Row>
        <Typography.Title level={3}>
          <FormattedMessage
            id="preference.extensions.toolExtensions"
            defaultMessage="Tool Extensions"
          />
        </Typography.Title>
        {remoteToolExtensions.map(e => (
          <Col key={e.id} span={12}>
            <ExtensionCard
              className={styles.extensionCard}
              manifest={getLocaleExtensionManifest(e.manifest, locale)}
              actions={cardActions(e)}
            ></ExtensionCard>
          </Col>
        ))}
      </Row>
      <Row>
        <Typography.Title level={3}>
          <FormattedMessage
            id="preference.extensions.clipExtensions"
            defaultMessage="Clip Extensions"
          />
        </Typography.Title>
        {remoteClipExtensions.map(e => (
          <Col key={e.id} span={12}>
            <ExtensionCard
              className={styles.extensionCard}
              manifest={getLocaleExtensionManifest(e.manifest, locale)}
              actions={cardActions(e)}
            ></ExtensionCard>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default Page;
