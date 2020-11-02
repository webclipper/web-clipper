import React from 'react';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';

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
