import { FormComponentProps } from 'antd/lib/form';
import React, { Component, Fragment } from 'react';
import { Form, Checkbox, Input } from 'antd';

interface FormOwnProps {
  info?: { host?: string; agreement?: boolean };
}

type FormProps = FormOwnProps & FormComponentProps;

export default class YuqueForm extends Component<FormProps> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { info } = this.props;

    if (info) {
      const { host, agreement } = info;
      return (
        <Fragment>
          <Form.Item label="域名">
            {getFieldDecorator('host', {
              initialValue: host,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 17, offset: 6 }}>
            {getFieldDecorator('agreement', {
              initialValue: agreement,
              valuePropName: 'checked',
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    console.log(value);
                    if (!value) {
                      callback('需要同意');
                    }
                    callback();
                  },
                },
              ],
            })(<Checkbox>允许插件使用 yuque 的 cookie 上传图片</Checkbox>)}
          </Form.Item>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Form.Item label="域名">
          {getFieldDecorator('host', {
            initialValue: 'https://yuque.com',
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 17, offset: 6 }}>
          {getFieldDecorator('agreement', {
            initialValue: true,
            valuePropName: 'checked',
            rules: [
              {
                validator: (_rule, value, callback) => {
                  console.log(value);
                  if (!value) {
                    callback('需要同意');
                  }
                  callback();
                },
              },
            ],
          })(<Checkbox>允许插件使用语雀的 cookie 上传图片</Checkbox>)}
        </Form.Item>
      </Fragment>
    );
  }
}
