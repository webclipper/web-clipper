import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Input } from 'antd';
import React, { Component, Fragment } from 'react';
import { ObsidianFormConfig } from './interface';

interface OneNoteProps {
  info?: ObsidianFormConfig;
}

export default class extends Component<OneNoteProps & FormComponentProps> {
  render() {
    const {
      form: { getFieldDecorator },
      info,
    } = this.props;
    let initData: Partial<ObsidianFormConfig> = {};
    if (info) {
      initData = info;
    }
    return (
      <Fragment>
        <Form.Item label="Vault">
          {getFieldDecorator('vault', {
            initialValue: initData.vault,
            rules: [
              {
                required: true,
                message: 'Please input your vault!',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Save Folder">
          {getFieldDecorator('folder', {
            initialValue: initData.folder,
            rules: [
              {
                required: true,
                message: 'Please input the folders you want to save!',
              },
            ],
          })(<Input.TextArea placeholder='Please enter the folders you want to save, one per line.' />)}
        </Form.Item>
      </Fragment>
    );
  }
}
