import React, { useEffect } from 'react';
import { connect } from 'dva';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import { Card, Icon, Row, Col, Typography } from 'antd';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import { setDefaultExtensionId } from '@/actions/extension';
import { FormattedMessage } from 'react-intl';
import { trackEvent } from '@/common/gs';

const mapStateToProps = ({ extension: { extensions, defaultExtensionId } }: GlobalStore) => {
  return {
    extensions,
    defaultExtensionId,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;

type PageProps = PageStateProps & DvaRouterProps;

const Page: React.FC<PageProps> = ({
  extensions,
  defaultExtensionId,
  dispatch,
  location: { pathname },
}) => {
  const [toolExtensions, clipExtensions] = useFilterExtensions(extensions);

  const handleSetDefault = (extensionId: string) => {
    dispatch(setDefaultExtensionId.started(extensionId));
  };

  useEffect(() => {
    trackEvent('LoadPage', pathname);
  }, [pathname]);

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
          const title = manifest.name;
          return (
            <Col key={id} span={12}>
              <Card style={{ height: 100, marginBottom: 20 }}>
                <Card.Meta
                  avatar={<Icon type={manifest.icon} />}
                  title={title}
                  description={manifest.description || '暂无'}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
      <Typography.Title level={3}>
        <FormattedMessage
          id="preference.extensions.clipExtensions"
          defaultMessage="Clip Extensions"
        />
      </Typography.Title>
      <Row gutter={10}>
        {clipExtensions.map(({ manifest, id }) => {
          const title = manifest.name;

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
              <Card style={{ marginBottom: 20 }} actions={actions}>
                <Card.Meta
                  avatar={<Icon type={manifest.icon} />}
                  title={title}
                  description={manifest.description || '暂无'}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default connect(mapStateToProps)(Page);
