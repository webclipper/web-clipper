import React from 'react';
import { Button, List, Avatar, Skeleton, Row, Col } from 'antd';
import IconFont from '@/components/IconFont';
import { stringify } from 'qs';
import { IConfigService } from '@/service/common/config';
import { Container } from 'typedi';
import config from '@/config';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import { IPowerpackService } from '@/service/common/powerpack';
import { useObserver } from 'mobx-react';
import { loadingStatus } from '@/common/loading';

const feature = [
  {
    icon: 'mail',
    id: 'preference.powerpack.feature.saveToEmail',
    defaultMessage: 'Save To Email',
    description: 'preference.powerpack.feature.saveToEmail.description',
    descriptionDefaultMessage: 'Save web page to specified email',
  },
  {
    icon: 'ocr',
    id: 'preference.powerpack.feature.ocr',
    defaultMessage: 'OCR',
    description: 'preference.powerpack.feature.ocr.description',
    descriptionDefaultMessage: 'Recognize text in pictures',
  },
  {
    icon: 'kindle',
    id: 'preference.powerpack.feature.sendToKindle',
    defaultMessage: 'Send To Kindle',
    description: 'preference.powerpack.feature.sendToKindle.description',
    descriptionDefaultMessage: 'Save web pages to kindle for reading',
  },
  {
    icon: 'coffee',
    id: 'preference.powerpack.feature.coffee',
    defaultMessage: 'Buy me a Coffee',
    description: 'preference.powerpack.feature.coffee.description',
    descriptionDefaultMessage: 'Give the author the motivation to maintain this project',
  },
];

const Powerpack: React.FC = () => {
  const githubOauthUrl = `https://github.com/login/oauth/authorize?${stringify({
    client_id: config.githubClientId,
    redirect_uri: config.githubCallback,
    scope: 'user:email',
    state: Container.get(IConfigService).id,
  })}`;

  const googleOauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringify({
    client_id: config.googleOauth.clientId,
    redirect_uri: config.googleOauth.callback,
    include_granted_scopes: true,
    response_type: 'code',
    scope: 'email profile',
    state: Container.get(IConfigService).id,
  })}`;

  const powerpackService = Container.get(IPowerpackService);

  const { userInfo, accessToken, loading } = useObserver(() => {
    const { userInfo, accessToken } = powerpackService;
    return {
      userInfo,
      accessToken,
      loading: loadingStatus(powerpackService).startup || loadingStatus(powerpackService).refresh,
    };
  });
  if (loading) {
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
            <Button key="reload" type="link" onClick={powerpackService.refresh}>
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
          <div>
            <Button href={githubOauthUrl} target="_blank">
              <IconFont type="github" />
              <FormattedMessage
                id="preference.powerpack.login.github"
                defaultMessage="Login with Github"
              />
            </Button>
            <Button href={googleOauthUrl} target="_blank" style={{ marginLeft: 10 }}>
              <IconFont type="google" />
              <FormattedMessage
                id="preference.powerpack.login.google"
                defaultMessage="Login with Google"
              />
            </Button>
          </div>
        </div>
      </div>
      <h3>
        <FormattedMessage id="preference.powerpack.features" defaultMessage="Features" />
      </h3>
      <Row>
        {feature.map(o => (
          <Col span={12} key={o.id}>
            <Row align="middle" style={{ marginBottom: 16 }}>
              <Col span={5}>
                <IconFont
                  type={o.icon}
                  style={{ fontSize: 48, border: '1px solid #e4e4e4', padding: 8 }}
                ></IconFont>
              </Col>
              <Col span={19}>
                <div style={{ fontSize: 16 }}>
                  <FormattedMessage id={o.id} defaultMessage={o.defaultMessage} />
                </div>
                <div style={{ color: 'rgba(0, 0, 0, 0.45)', wordBreak: 'break-word' }}>
                  <FormattedMessage
                    id={o.description}
                    defaultMessage={o.descriptionDefaultMessage}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Powerpack;
