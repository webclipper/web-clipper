import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment } from 'react';
import { JoplinBackendServiceConfig } from './interface';

interface FormProps extends FormComponentProps {
  verified?: boolean;
  info?: JoplinBackendServiceConfig;
}

const InitForm: React.FC<FormProps> = ({ form: { getFieldDecorator }, info, verified }) => {
  return (
    <Fragment>
      <Form.Item label="Authorization token">
        {getFieldDecorator('token', {
          initialValue: info?.token,
          rules: [
            {
              required: true,
              message: 'Authorization token is required!',
            },
          ],
        })(<Input disabled={verified} />)}
      </Form.Item>
    </Fragment>
  );
};

export default InitForm;
