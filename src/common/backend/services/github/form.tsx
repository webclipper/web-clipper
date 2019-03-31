import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Component, Fragment } from 'react';

export default class YuqueForm extends Component<FormComponentProps> {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <Form.Item label="域名">
          {getFieldDecorator('host', {
            initialValue: 'https://api.github.com/',
            rules: [{ required: true, message: '请填写域名' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="AccessToken">
          {getFieldDecorator('accessToken', {
            rules: [
              {
                required: true,
                message: '请填写 AccessToken',
              },
            ],
          })(<Input />)}
        </Form.Item>
      </Fragment>
    );
  }
}
