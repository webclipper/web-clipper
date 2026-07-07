import React, { Fragment } from 'react';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';

interface Props extends FormComponentProps {
  info: {
    uploadUrl: string;
    secret: string;
  };
}

export default ({ form: { getFieldDecorator }, info }: Props) => {
  const initInfo: Partial<Props['info']> = info || {};
  return (
    <Fragment>
      <Form.Item label="UploadUrl">
        {getFieldDecorator('uploadUrl', {
          initialValue: initInfo.uploadUrl,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input PicGo upload URL"></Input>)}
      </Form.Item>
      <Form.Item label="Secret">
        {getFieldDecorator('secret', {
          initialValue: initInfo.secret,
        })(<Input placeholder="please input PicGo server secret (if needed)"></Input>)}
      </Form.Item>
    </Fragment>
  );
};
