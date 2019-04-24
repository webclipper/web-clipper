import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Checkbox } from 'antd';

export default ({ form: { getFieldDecorator } }: FormComponentProps) => (
  <Form.Item wrapperCol={{ span: 17, offset: 6 }}>
    {getFieldDecorator('agreement', {
      initialValue: true,
      valuePropName: 'checked',
      rules: [
        {
          validator: (_rule, value, callback) => {
            if (!value) {
              callback('需要同意');
            }
            callback();
          },
        },
      ],
    })(<Checkbox>允许插件使用语雀的 cookie 上传图片</Checkbox>)}
  </Form.Item>
);
