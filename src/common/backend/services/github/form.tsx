import { KeyOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input, Select, Tooltip } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import { GithubBackendServiceConfig } from './interface';
import { FormattedMessage } from 'react-intl';
import locale from '@/common/locales';
import { stringify } from 'qs';

interface GithubFormProps {
  verified?: boolean;
  info?: GithubBackendServiceConfig;
}

const GenerateNewTokenUrl = `https://github.com/settings/tokens/new?${stringify({
  scopes: 'repo',
  description: 'Web Clipper',
})}`;

const visibilityOptions = [
  {
    label: (
      <FormattedMessage id="backend.services.github.form.visibility.all" defaultMessage="All" />
    ),
    value: 'all',
  },
  {
    label: (
      <FormattedMessage
        id="backend.services.github.form.visibility.public"
        defaultMessage="Public"
      />
    ),
    value: 'public',
  },
  {
    label: (
      <FormattedMessage
        id="backend.services.github.form.visibility.private"
        defaultMessage="Private"
      />
    ),
    value: 'private',
  },
];

const GithubForm: React.FC<GithubFormProps & FormComponentProps> = ({
  form: { getFieldDecorator },
  info,
  verified,
}) => {
  const disabled = verified || !!info;
  let initAccessToken;
  let visibility;
  if (info) {
    initAccessToken = info.accessToken;
    visibility = info.visibility;
  }
  return (
    <Fragment>
      <Form.Item
        label={
          <FormattedMessage
            id="backend.services.github.form.visibility"
            defaultMessage="Visibility"
          />
        }
      >
        {getFieldDecorator('visibility', {
          initialValue: visibility,
        })(
          <Select allowClear>
            {visibilityOptions.map(o => (
              <Select.Option value={o.value} key={o.value}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="AccessToken">
        {getFieldDecorator('accessToken', {
          initialValue: initAccessToken,
          rules: [
            {
              required: true,
              message: (
                <FormattedMessage
                  id="backend.services.github.accessToken.message"
                  defaultMessage="AccessToken is required"
                />
              ),
            },
          ],
        })(
          <Input
            disabled={disabled}
            suffix={
              <Tooltip
                title={
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {locale.format({
                      id: 'backend.services.github.form.GenerateNewToken',
                      defaultMessage: 'Generate new token',
                    })}
                  </span>
                }
              >
                <a href={GenerateNewTokenUrl} target={GenerateNewTokenUrl}>
                  <KeyOutlined />
                </a>
              </Tooltip>
            }
          />
        )}
      </Form.Item>
    </Fragment>
  );
};

export default GithubForm;
