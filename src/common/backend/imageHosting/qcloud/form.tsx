import React, { Fragment } from 'react';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input, InputNumber, Checkbox } from 'antd';
import { QcloudCosImageHostingOption } from './service';

interface Props extends FormComponentProps {
  info: QcloudCosImageHostingOption;
}

export default ({ form: { getFieldDecorator }, info }: Props) => {
  const initInfo: Partial<Props['info']> = info || {};
  return (
    <Fragment>
      <Form.Item label="Bucket">
        {getFieldDecorator('bucket', {
          initialValue: initInfo.bucket,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input Bucket"></Input>)}
      </Form.Item>
      <Form.Item label="Region">
        {getFieldDecorator('region', {
          initialValue: initInfo.region,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input Region"></Input>)}
      </Form.Item>
      <Form.Item label="Folder">
        {getFieldDecorator('folder', {
          initialValue: initInfo.folder,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input Folder"></Input>)}
      </Form.Item>
      <Form.Item label="SecretId">
        {getFieldDecorator('secretId', {
          initialValue: initInfo.secretId,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input SecretId"></Input>)}
      </Form.Item>
      <Form.Item label="SecretKey">
        {getFieldDecorator('secretKey', {
          initialValue: initInfo.secretKey,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input.Password placeholder="please input SecretKey" min={0}></Input.Password>)}
      </Form.Item>
      <Form.Item label="PrivateRead">
        {getFieldDecorator('privateRead', {
          initialValue: initInfo.privateRead,
          valuePropName: 'checked',
          rules: [
            {
              required: false,
            },
          ],
        })(<Checkbox />)}
      </Form.Item>
      <Form.Item label="Expires">
        {getFieldDecorator('expires', {
          initialValue: initInfo.expires,
          rules: [
            {
              required: true,
            },
          ],
        })(<InputNumber placeholder="please input Expires"></InputNumber>)}
      </Form.Item>
    </Fragment>
  );
};
