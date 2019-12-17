import React from 'react';
import { Button, List, Avatar, Skeleton, Row, Col } from 'antd';
import IconFont from '@/components/IconFont';
import { stringify } from 'qs';
import browserId from '@/common/id';
import config from '@/config';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import useAsync from '@/common/hooks/useAsync';
import Container from 'typedi';
import { IPowerpackService } from '@/service/common/powerpack';
import { useObserver } from 'mobx-react';

const feature = [
  {
    icon: 'mail',
    id: 'preference.powerpack.feature.saveToEmail',
    defaultMessage: 'Save To Email',
  },
  {
    icon: 'mail',
    id: 'preference.powerpack.feature.ocr',
    defaultMessage: 'OCR',
  },
  {
    icon: 'kindle',
    id: 'preference.powerpack.feature.sendToKindle',
    defaultMessage: 'Send To Kindle',
  },
];

const Powerpack: React.FC = () => {
  const githubOauthUrl = `https://github.com/login/oauth/authorize?${stringify({
    client_id: config.githubClientId,
    redirect_uri: config.githubCallback,
    scope: 'user:email',
    state: browserId(),
  })}`;

  const powerpackService = Container.get(IPowerpackService);

  const { userInfo, accessToken, loading } = useObserver(() => {
    const { userInfo, accessToken, loading } = powerpackService;
    return { userInfo, accessToken, loading };
  });

  const refreshToken = useAsync(() => powerpackService.refresh(), [], {
    manual: true,
  });

  if (loading || refreshToken.loading) {
    return <Skeleton></Skeleton>;
  }

  if (userInfo) {
    return (
      <div>
        <List.Item
          actions={[
            <Button
              key="logout"
              type="link"
              style={{ color: 'red' }}
              onClick={powerpackService.logout}
            >
              <FormattedMessage id="preference.powerpack.logout" defaultMessage="Logout" />
            </Button>,
            <Button key="reload" type="link" onClick={refreshToken.run}>
              <FormattedMessage id="preference.powerpack.reload" defaultMessage="Reload" />
            </Button>,
            <Button
              key="upgrade"
              type="link"
              href={`https://clipper.website/powerpack?guest_email=${encodeURIComponent(
                userInfo.email
              )}`}
              target="_blank"
            >
              <FormattedMessage id="preference.powerpack.upgrade" defaultMessage="Upgrade" />
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={userInfo.avatar_url} />}
            title={userInfo.name}
            description={userInfo.email}
          />
          <div>
            <FormattedMessage id="preference.powerpack.expiry" defaultMessage="Expiry" /> :
            {dayjs(userInfo.expire_date)
              .add(1, 'day')
              .format('YYYY-MM-DD')}
          </div>
        </List.Item>
      </div>
    );
  }

  if (accessToken) {
    return (
      <div>
        <h1>
          <FormattedMessage
            id="preference.powerpack.failed"
            defaultMessage="Failed to
          load powerpack info."
          />
        </h1>
        <Button type="primary" onClick={powerpackService.startup}>
          <FormattedMessage id="preference.powerpack.reload" defaultMessage="Reload" />
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={powerpackService.logout}>
          <FormattedMessage id="preference.powerpack.logout" defaultMessage="Logout" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <h2>
            <FormattedMessage
              id="preference.powerpack.activate"
              defaultMessage="Activate Powerpack
          to unlock many more great feature"
            />
          </h2>
          <h3>
            <FormattedMessage
              id="preference.powerpack.free.trial"
              defaultMessage="Free trial for 7 days !"
            />
          </h3>
          <Button href={githubOauthUrl} target="_blank">
            <IconFont type="github" />
            <FormattedMessage
              id="preference.powerpack.login.github"
              defaultMessage="Login with Github"
            />
          </Button>
        </div>
      </div>
      <h3>
        <FormattedMessage id="preference.powerpack.features" defaultMessage="Features" />
      </h3>
      <Row>
        {feature.map((o, index) => (
          <Col span={8} key={o.id}>
            {index + 1}.{<FormattedMessage id={o.id} defaultMessage={o.defaultMessage} />}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Powerpack;
