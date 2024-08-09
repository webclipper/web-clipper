import React, { Fragment } from 'react';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';

interface Props extends FormComponentProps {
  info: {
    uploadUrl: string;
    key: string;
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
        })(<Input placeholder="please input piclist upload URL"></Input>)}
      </Form.Item>
      <Form.Item label="Key">
        {getFieldDecorator('key', {
          initialValue: initInfo.key,
        })(<Input placeholder="please input upload key (if needed)"></Input>)}
      </Form.Item>
    </Fragment>
  );
};
