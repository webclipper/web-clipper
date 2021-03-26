import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import React, { Fragment } from 'react';
import { BaklibBackendServiceConfig } from './interface';
import useOriginForm from '@/hooks/useOriginForm';
import { FormattedMessage } from 'react-intl';

interface BaklibFormProps {
  verified?: boolean;
  info?: BaklibBackendServiceConfig;
}

const FormItem: React.FC<BaklibFormProps & FormComponentProps> = props => {
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

  let initData: Partial<BaklibBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
  return (
    <Fragment>
      <Form.Item label="Host">
        {getFieldDecorator('origin', {
          initialValue: initData.origin || 'https://www.baklib.com',
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
                id="backend.services.baklib.form.authentication"
                defaultMessage="Authentication"
              />
            }
            disabled={editMode || formVerified}
            onSearch={handleAuthentication}
          />
        )}
      </Form.Item>
      <Form.Item label="AccessToken">
        {getFieldDecorator('accessToken', {
          initialValue: initData.accessToken,
          rules: [
            {
              required: true,
              message: 'AccessToken is required!',
            },
          ],
        })(<Input disabled={editMode || verified || !formVerified} />)}
      </Form.Item>
    </Fragment>
  );
};

export default FormItem;
