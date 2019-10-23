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
import { FormattedMessage } from 'react-intl';
import useAsync from '@/common/hooks/useAsync';
import { refresh } from '@/common/server';

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

  const refreshToken = useAsync(() => refresh(), [], {
    manual: true,
    onSuccess(r) {
      localStorageService.set(LOCAL_ACCESS_TOKEN_LOCALE_KEY, r.result);
    },
  });

  const dispatch = useDispatch();

  const reload = () => dispatch(initPowerpack.started());

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
              onClick={() => {
                localStorageService.set(LOCAL_ACCESS_TOKEN_LOCALE_KEY, '');
              }}
            >
              <FormattedMessage id="preference.powerpack.logout" defaultMessage="Logout" />
            </Button>,
            <Button key="reload" type="link" onClick={refreshToken.run}>
              <FormattedMessage id="preference.powerpack.reload" defaultMessage="Reload" />
            </Button>,
            <Button
              key="upgrade"
              type="link"
              href="https://clipper.website/powerpack"
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
        <Button type="primary" onClick={reload}>
          <FormattedMessage id="preference.powerpack.reload" defaultMessage="Reload" />
        </Button>
      </div>
    );
  }

  return (
    <div style={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
  );
};

export default Powerpack;
