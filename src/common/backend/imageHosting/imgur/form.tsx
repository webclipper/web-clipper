import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Input } from 'antd';

interface Props extends FormComponentProps {
  info: {
    clientId: string;
  };
}

export default ({ form: { getFieldDecorator }, info }: Props) => {
  const initInfo: Partial<Props['info']> = info || {};
  return (
    <Form.Item label="ClientId">
      {getFieldDecorator('clientId', {
        initialValue: initInfo.clientId,
        rules: [
          {
            required: true,
          },
        ],
      })(<Input placeholder="please input clientId"></Input>)}
    </Form.Item>
  );
};
