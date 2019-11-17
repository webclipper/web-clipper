import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment } from 'react';
import { GithubBackendServiceConfig } from './interface';
import { FormattedMessage } from 'react-intl';

interface GithubFormProps {
  verified?: boolean;
  info?: GithubBackendServiceConfig;
  loadAccount: any;
}

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
        })(<Input disabled={disabled} />)}
      </Form.Item>
    </Fragment>
  );
};

export default GithubForm;
