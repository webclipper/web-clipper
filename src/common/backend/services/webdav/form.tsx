import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment } from 'react';
import { WebDAVServiceConfig } from './interface';
import useOriginForm from '@/hooks/useOriginForm';
import { FormattedMessage } from 'react-intl';
import PowerpackForm from '@/components/powerpackForm';

interface FormProps extends FormComponentProps {
  info?: WebDAVServiceConfig;
}

const ConfigForm: React.FC<FormProps> = ({ form, form: { getFieldDecorator }, info }) => {
  const { verified, handleAuthentication, formRules } = useOriginForm({ form, initStatus: !!info });
  return (
    <Fragment>
      <PowerpackForm form={form} />
      <Form.Item
        label={
          <FormattedMessage id="backend.services.confluence.form.origin" defaultMessage="Origin" />
        }
      >
        {form.getFieldDecorator('origin', {
          initialValue: info?.origin,
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
      {verified && (
        <React.Fragment>
          <Form.Item label="Username">
            {getFieldDecorator('username', {
              initialValue: info?.username,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled={!!info} />)}
          </Form.Item>
          <Form.Item label="Password">
            {getFieldDecorator('password', {
              initialValue: info?.password,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled={!!info} />)}
          </Form.Item>
        </React.Fragment>
      )}
    </Fragment>
  );
};

export default ConfigForm;
