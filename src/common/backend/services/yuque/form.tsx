import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input, Select } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Component, Fragment } from 'react';
import { YuqueBackendServiceConfig, RepositoryType } from './interface';
import { FormattedMessage } from 'react-intl';

interface YuqueFormProps {
  verified?: boolean;
  info?: YuqueBackendServiceConfig;
}

const RepositoryTypeOptions = [
  {
    key: RepositoryType.all,
    label: (
      <FormattedMessage
        id="backend.services.yuque.form.showAllRepository"
        defaultMessage="Show All Repository"
      />
    ),
  },
  {
    key: RepositoryType.self,
    label: (
      <FormattedMessage
        id="backend.services.yuque.form.showSelfRepository"
        defaultMessage="Show Self Repository"
      />
    ),
  },
  {
    key: RepositoryType.group,
    label: (
      <FormattedMessage
        id="backend.services.yuque.form.showGroupRepository"
        defaultMessage="Show Group Repository"
      />
    ),
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
        <Form.Item
          label={
            <FormattedMessage
              id="backend.services.yuque.form.repositoryType"
              defaultMessage="Repository Type"
            ></FormattedMessage>
          }
        >
          {getFieldDecorator('repositoryType', {
            initialValue: initData.repositoryType,
            rules: [{ required: true, message: 'repositoryType is required!' }],
          })(
            <Select>
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
