import React from 'react';
import { Button } from 'antd';
import IconFont from '@/components/IconFont';
import { stringify } from 'qs';
import browserId from '@/common/id';
import config from '@/config';

interface PowerpackProps {}

const Powerpack: React.FC<PowerpackProps> = _props => {
  const githubOauthUrl = `https://github.com/login/oauth/authorize?${stringify({
    client_id: config.githubClientId,
    redirect_uri: config.githubCallback,
    scope: 'user:email',
    state: browserId(),
  })}`;

  return (
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
