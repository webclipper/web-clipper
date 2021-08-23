import React from 'react';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';

interface Props extends FormComponentProps {
  info: {
    secretToken: string;
  };
}

export default ({ form: { getFieldDecorator }, info }: Props) => {
  const initInfo: Partial<Props['info']> = info || {};
  return (
    <Form.Item label="Secret Token">
      {getFieldDecorator('secretToken', {
        initialValue: initInfo.secretToken,
      })(<Input placeholder="please input Secret Token"></Input>)}
    </Form.Item>
  );
};
