import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import React, { Fragment } from 'react';
import useOriginForm from '@/hooks/useOriginForm';
import { FormattedMessage } from 'react-intl';
import { WallabagBackendServiceConfig } from 'common/backend/clients/wallabag/interface';

interface WallabagFormProps {
  verified?: boolean;
  info?: WallabagBackendServiceConfig;
}

const FormItem: React.FC<WallabagFormProps & FormComponentProps> = props => {
  const {
    form,
    form: { getFieldDecorator },
    info,
    verified,
  } = props;

  const { verified: formVerified, handleAuthentication, formRules } = useOriginForm({
    form,
    initStatus: !!info,
  });

  let initData: Partial<WallabagBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
  return (
    <Fragment>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.confluence.form.origin" defaultMessage="Origin" />
        }
      >
        {form.getFieldDecorator('wallabag_host', {
          initialValue: info?.wallabag_host || 'https://app.wallabag.it',
          rules: formRules,
        })(
          <Input.Search
            enterButton={
              <FormattedMessage
                id="backend.services.confluence.form.authentication"
                defaultMessage="Authentication"
              />
            }
            onSearch={handleAuthentication}
            disabled={verified}
          />
        )}
      </Form.Item>
      <Form.Item label="Access Token">
        {getFieldDecorator('access_token', {
          initialValue: initData.access_token,
          rules: [
            {
              required: true,
              message: 'Access Token is required!',
            },
          ],
        })(<Input disabled={editMode || verified || !formVerified} />)}
      </Form.Item>
      <Form.Item label="Refresh Token">
        {getFieldDecorator('refresh_token', {
          initialValue: initData.refresh_token,
          rules: [
            {
              required: true,
              message: 'Refresh Token is required!',
            },
          ],
        })(<Input disabled={editMode || verified || !formVerified} />)}
      </Form.Item>
      <Form.Item label="Client Id">
        {getFieldDecorator('client_id', {
          initialValue: initData.client_id,
          rules: [
            {
              required: true,
              message: 'Client Id is required!',
            },
          ],
        })(<Input disabled={editMode || verified || !formVerified} />)}
      </Form.Item>
      <Form.Item label="Client Secret">
        {getFieldDecorator('client_secret', {
          initialValue: initData.client_secret,
          rules: [
            {
              required: true,
              message: 'Client Secret is required!',
            },
          ],
        })(<Input disabled={editMode || verified || !formVerified} />)}
      </Form.Item>
    </Fragment>
  );
};

export default FormItem;
