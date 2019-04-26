import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Component, Fragment } from 'react';
import { YuqueBackendServiceConfig, RepositoryType } from './interface';

interface YuqueFormProps {
  verified?: boolean;
  info?: YuqueBackendServiceConfig;
}

const RepositoryTypeOptions = [
  {
    key: RepositoryType.all,
    label: '显示全部的知识库',
  },
  {
    key: RepositoryType.self,
    label: '只显示自己的知识库',
  },
  {
    key: RepositoryType.group,
    label: '只显示团队的知识库',
  },
];
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
        <Form.Item label="知识库类型">
          {getFieldDecorator('repositoryType', {
            initialValue: initData.repositoryType,
            rules: [{ required: true, message: 'repositoryType is required!' }],
          })(
            <Select disabled={editMode || verified}>
              {RepositoryTypeOptions.map(o => (
                <Select.Option key={o.key}>{o.label}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Fragment>
    );
  }
}
