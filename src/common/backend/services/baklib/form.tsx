import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import React, { Component, Fragment } from 'react';
import { BaklibBackendServiceConfig } from './interface';

interface YuqueFormProps {
  verified?: boolean;
  info?: BaklibBackendServiceConfig;
}

export default class extends Component<YuqueFormProps & FormComponentProps> {
  render() {
    const {
      form: { getFieldDecorator },
      info,
      verified,
    } = this.props;

    let initData: Partial<BaklibBackendServiceConfig> = {};
    if (info) {
      initData = info;
    }
    let editMode = info ? true : false;
    return (
      <Fragment>
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
