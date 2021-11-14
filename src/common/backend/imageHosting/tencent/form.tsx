import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Form } from '@ant-design/compatible';
import { Input } from 'antd';

import { TencentImageHostingOption } from './type';


interface Props extends FormComponentProps {
  info: TencentImageHostingOption;
}

export default ({ form: { getFieldDecorator }, info }: Props) => {
  const initInfo: Partial<Props['info']> = info || {};
  return (
    <Fragment>
      <Form.Item label="secretId">
        {getFieldDecorator('secretId', {
          initialValue: initInfo.secretId,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input secretId"></Input>)}
      </Form.Item>
      <Form.Item label="secretKey">
        {getFieldDecorator('secretKey', {
          initialValue: initInfo.secretKey,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input secretKey"></Input>)}
      </Form.Item>
      <Form.Item label="bucket">
        {getFieldDecorator('bucket', {
          initialValue: initInfo.bucket,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input bucket"></Input>)}
      </Form.Item>
      <Form.Item label="region">
        {getFieldDecorator('region', {
          initialValue: initInfo.region,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input region"></Input>)}
      </Form.Item>
      <Form.Item label="savePath">
        {getFieldDecorator('savePath', {
          initialValue: initInfo.savePath,
          rules: [
            {
              required: false,
            },
          ],
        })(<Input placeholder="please input savePath"></Input>)}
      </Form.Item>
      <Form.Item label="domain">
        {getFieldDecorator('domain', {
          initialValue: initInfo.domain,
          rules: [
            {
              required: false,
              message: (
                <FormattedMessage
                  id="hooks.useOriginForm.origin.message"
                  defaultMessage={`Wrong format,Examples https://developer.mozilla.org`}
                />
              )
            },
          ],
        })(<Input placeholder="please input domain"></Input>)}
      </Form.Item>

    </Fragment>
  );
};

