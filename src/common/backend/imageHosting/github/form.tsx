import React, { Fragment } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Input } from 'antd';

interface Props extends FormComponentProps {
  info: {
    accessToken: string;
    relativePath: string;
    repositoryName: string;
  };
}

export default ({ form: { getFieldDecorator }, info }: Props) => {
  const initInfo: Partial<Props['info']> = info || {};
  return (
    <Fragment>
      <Form.Item label="AccessToken">
        {getFieldDecorator('accessToken', {
          initialValue: initInfo.accessToken,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="please input gthub access token"></Input>)}
      </Form.Item>
      <Form.Item label="Relative Path">
        {getFieldDecorator('relativePath', {
          initialValue: initInfo.relativePath,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="just like /picture/"></Input>)}
      </Form.Item>
      <Form.Item label="Repository Name">
        {getFieldDecorator('repositoryName', {
          initialValue: initInfo.repositoryName,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="just like web-clipper"></Input>)}
      </Form.Item>
    </Fragment>
  );
};
