import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Component, Fragment } from 'react';
import { OneNoteBackendServiceConfig } from './interface';

interface OneNoteProps {
  verified?: boolean;
  info?: OneNoteBackendServiceConfig;
}

export default class extends Component<OneNoteProps & FormComponentProps> {
  render() {
    const {
      form: { getFieldDecorator },
      info,
      verified,
    } = this.props;

    let initData: Partial<OneNoteBackendServiceConfig> = {};
    if (info) {
      initData = info;
    }
    let editMode = info ? true : false;
    return (
      <Fragment>
        <Form.Item label="AccessToken">
          {getFieldDecorator('access_token', {
            initialValue: initData.access_token,
            rules: [
              {
                required: true,
                message: 'AccessToken is required!',
              },
            ],
          })(<Input disabled={editMode || verified} />)}
        </Form.Item>
        <Form.Item label="RefreshToken">
          {getFieldDecorator('refresh_token', {
            initialValue: initData.refresh_token,
            rules: [
              {
                required: true,
                message: 'RefreshToken is required!',
              },
            ],
          })(<Input disabled={editMode || verified} />)}
        </Form.Item>
      </Fragment>
    );
  }
}
