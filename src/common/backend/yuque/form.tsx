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
            initialValue: 'https://www.yuque.com/api/v2/',
            rules: [{ required: true, message: 'baseURL is required!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="AccessToken">
          {getFieldDecorator('accessToken', {
            rules: [
              {
                required: true,
                message: 'AccessToken is required!',
              },
            ],
          })(<Input />)}
        </Form.Item>
      </Fragment>
    );
  }
}
