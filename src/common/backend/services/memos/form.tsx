import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import React, { Fragment } from 'react';
import { MemosBackendServiceConfig } from './interface';
import useOriginForm from '@/hooks/useOriginForm';
import { FormattedMessage } from 'react-intl';

interface MemosFormProps {
  verified?: boolean;
  info?: MemosBackendServiceConfig;
}

const FormItem: React.FC<MemosFormProps & FormComponentProps> = props => {
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

  let initData: Partial<MemosBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
  return (
    <Fragment>
      <Form.Item label="Host">
        {getFieldDecorator('origin', {
          initialValue: initData.origin || 'https://demo.usememos.com',
          rules: [
            {
              required: true,
              message: (
								<FormattedMessage
                id="backend.services.memos.form.authentication"
                defaultMessage="Host URL requeired!"
              />
							),
							type: 'url',
            },
            ...formRules,
          ],
        })(
          <Input.Search
            enterButton={
              <FormattedMessage
                id="backend.services.memos.form.hostTest"
                defaultMessage="test"
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
              message: (
								<FormattedMessage
                id="backend.services.memos.accessToken.message"
                defaultMessage='AccessToken is required!'
              />),
            },
          ],
        })(<Input
					disabled={editMode || verified || !formVerified}
					/>)}
      </Form.Item>
    </Fragment>
  );
};

export default FormItem;
