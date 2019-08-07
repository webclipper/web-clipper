import React from 'react';
import { connect } from 'dva';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import { Card, Icon, Row, Col, Typography } from 'antd';
import { ExtensionType } from '@web-clipper/extensions';

const mapStateToProps = ({ extension: { extensions } }: GlobalStore) => {
  return {
    extensions,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;

type PageProps = PageStateProps & DvaRouterProps;

const Page: React.FC<PageProps> = ({ extensions }) => {
  return (
    <div>
      <Typography.Title level={3}>扩展插件</Typography.Title>
      <Row gutter={10}>
        {extensions
          .filter(o => o.type === ExtensionType.Tool)
          .map(({ manifest, id }) => {
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
      <Typography.Title level={3}>剪藏插件</Typography.Title>
      <Row gutter={10}>
        {extensions
          .filter(o => o.type !== ExtensionType.Tool)
          .map(({ manifest, id }) => {
            const title = manifest.name;
            return (
              <Col key={id} span={12}>
                <Card style={{ marginBottom: 20 }}>
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
