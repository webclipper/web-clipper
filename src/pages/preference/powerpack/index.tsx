import React from 'react';
import { Button } from 'antd';
import IconFont from '@/components/IconFont';
import { stringify } from 'qs';
import browserId from '@/common/id';

interface PowerpackProps {}

const Powerpack: React.FC<PowerpackProps> = _props => {
  const githubOauthUrl = `https://github.com/login/oauth/authorize?${stringify({
    client_id: 'acad97d010cd6d7ef560',
    redirect_uri: 'http://localhost:3000/api/user/oauth/github',
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
