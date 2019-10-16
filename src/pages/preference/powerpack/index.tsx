import React from 'react';
import { Button, List, Avatar } from 'antd';
import IconFont from '@/components/IconFont';
import { stringify } from 'qs';
import browserId from '@/common/id';
import config from '@/config';
import { useSelector } from 'dva';
import { GlobalStore, LOCAL_ACCESS_TOKEN_LOCALE_KEY } from '@/common/types';
import dayjs from 'dayjs';
import { localStorageService } from '@/common/chrome/storage';

interface PowerpackProps {}

const Powerpack: React.FC<PowerpackProps> = () => {
  const githubOauthUrl = `https://github.com/login/oauth/authorize?${stringify({
    client_id: config.githubClientId,
    redirect_uri: config.githubCallback,
    scope: 'user:email',
    state: browserId(),
  })}`;

  const { userInfo } = useSelector((g: GlobalStore) => ({
    userInfo: g.userPreference.userInfo,
  }));

  return userInfo ? (
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
  ) : (
    <div>
      <p>Sign Up for Powerpack</p>
      <Button href={githubOauthUrl} target="_blank">
        <IconFont type="github"></IconFont>
        Login with Github
      </Button>
    </div>
  );
};

export default Powerpack;
