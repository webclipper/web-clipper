import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Component, Fragment } from 'react';

interface GithubFormProps {
  verified?: boolean;
  info?: {
    accessToken: string;
  };
}

export default class extends Component<GithubFormProps & FormComponentProps> {
  render() {
    const {
      form: { getFieldDecorator },
      info,
      verified,
    } = this.props;
    const disabled = verified || !!info;
    let initAccessToken;
    if (info) {
      initAccessToken = info.accessToken;
    }
    return (
      <Fragment>
        <Form.Item label="AccessToken">
          {getFieldDecorator('accessToken', {
            initialValue: initAccessToken,
            rules: [
              {
                required: true,
                message: '请填写 AccessToken',
              },
            ],
          })(<Input disabled={disabled} />)}
        </Form.Item>
      </Fragment>
    );
  }
}
