import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Component, Fragment } from 'react';

interface YuqueFormProps {
  verified?: boolean;
  info?: {
    host: string;
    accessToken: string;
  };
}

export default class extends Component<YuqueFormProps & FormComponentProps> {
  render() {
    const {
      form: { getFieldDecorator },
      info,
      verified,
    } = this.props;

    let initData: Partial<{
      host: string;
      accessToken: string;
    }> = {
      host: 'https://www.yuque.com/api/v2/',
    };

    if (info) {
      initData = {
        host: info.host,
        accessToken: info.accessToken,
      };
    }

    let editMode = info ? true : false;

    return (
      <Fragment>
        <Form.Item label="域名">
          {getFieldDecorator('host', {
            initialValue: initData.host,
            rules: [{ required: true, message: 'baseURL is required!' }],
          })(<Input disabled={editMode || verified} />)}
        </Form.Item>
        <Form.Item label="AccessToken">
          {getFieldDecorator('accessToken', {
            initialValue: initData.accessToken,
            rules: [
              {
                required: true,
                message: 'AccessToken is required!',
              },
            ],
          })(<Input disabled={editMode || verified} />)}
        </Form.Item>
      </Fragment>
    );
  }
}
