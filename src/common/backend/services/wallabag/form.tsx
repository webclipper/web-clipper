import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import React, { Fragment } from 'react';
import { WallabagBackendServiceConfig } from './interface';
import useOriginForm from '@/hooks/useOriginForm';
import { FormattedMessage } from 'react-intl';

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
      <Form.Item label="Host">
        {getFieldDecorator('origin', {
          initialValue: initData.origin || 'https://app.wallabag.it',
          rules: [
            {
              required: true,
              message: 'Host is required!',
            },
            ...formRules,
          ],
        })(
          <Input.Search
            enterButton={
              <FormattedMessage
                id="backend.services.wallabag.form.authentication"
                defaultMessage="Authentication"
              />
            }
            disabled={editMode || formVerified}
            onSearch={handleAuthentication}
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
