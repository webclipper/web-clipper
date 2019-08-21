import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Component, Fragment } from 'react';
import { YuqueBackendServiceConfig, RepositoryType } from './interface';

interface YuqueFormProps {
  verified?: boolean;
  info?: YuqueBackendServiceConfig;
}

export default class extends Component<YuqueFormProps & FormComponentProps> {
  render() {
    const {
      form: { getFieldDecorator },
      info,
      verified,
    } = this.props;

    let initData: Partial<YuqueBackendServiceConfig> = {
      repositoryType: RepositoryType.self,
    };
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
      </Fragment>
    );
  }
}
