import React from 'react';
import { Button, List, Avatar, Skeleton } from 'antd';
import IconFont from '@/components/IconFont';
import { stringify } from 'qs';
import browserId from '@/common/id';
import config from '@/config';
import { useSelector, useDispatch } from 'dva';
import { GlobalStore, LOCAL_ACCESS_TOKEN_LOCALE_KEY } from '@/common/types';
import dayjs from 'dayjs';
import { localStorageService } from '@/common/chrome/storage';
import { initPowerpack } from '@/actions/userPreference';

interface PowerpackProps {}

const Powerpack: React.FC<PowerpackProps> = () => {
  const githubOauthUrl = `https://github.com/login/oauth/authorize?${stringify({
    client_id: config.githubClientId,
    redirect_uri: config.githubCallback,
    scope: 'user:email',
    state: browserId(),
  })}`;

  const { userInfo, accessToken, loading } = useSelector(
    ({ userPreference, loading }: GlobalStore) => ({
      userInfo: userPreference.userInfo,
      accessToken: userPreference.accessToken,
      loading: loading.effects[initPowerpack.started.type],
    })
  );

  const dispatch = useDispatch();

  const reload = () => dispatch(initPowerpack.started());

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
              onClick={() => {
                localStorageService.set(LOCAL_ACCESS_TOKEN_LOCALE_KEY, '');
              }}
            >
              Logout
            </Button>,
            <Button
              key="upgrade"
              type="link"
              href="https://clipper.website/powerpack"
              target="_blank"
            >
              Upgrade
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={userInfo.avatar_url} />}
            title={userInfo.name}
            description={userInfo.email}
          />
          <div>
            Expiry:
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
        <h1>Failed to load powerpack info.</h1>
        <Button type="primary" onClick={reload}>
          Reload
        </Button>
      </div>
    );
  }

  return (
    <div style={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <h2>Activate Powerpack to unlock many more great feature</h2>
        <h3>Free trial for 7 days !</h3>
        <Button href={githubOauthUrl} target="_blank">
          <IconFont type="github"></IconFont>
          Login with Github
        </Button>
      </div>
    </div>
  );
};

export default Powerpack;
