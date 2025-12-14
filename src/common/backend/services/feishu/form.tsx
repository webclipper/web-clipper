import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input, Button, Alert } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Component, Fragment } from 'react';
import { FeishuBackendServiceConfig } from './interface';
import { FormattedMessage } from 'react-intl';

interface FeishuFormProps {
  verified?: boolean;
  info?: FeishuBackendServiceConfig;
}

export default class FeishuForm extends Component<FeishuFormProps & FormComponentProps> {
  handleLogin = () => {
    const workerUrl = this.props.form.getFieldValue('workerUrl');
    if (workerUrl) {
      window.open(`${workerUrl.replace(/\/$/, '')}/login`, '_blank');
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      info,
      verified,
    } = this.props;

    let initData: Partial<FeishuBackendServiceConfig> = {};
    if (info) {
      initData = info;
    }
    let editMode = info ? true : false;
    const workerUrl = getFieldValue('workerUrl') || initData.workerUrl;

    return (
      <Fragment>
        <Form.Item>
          <Alert
            message={
              <FormattedMessage
                id="backend.services.feishu.form.tip_worker"
                defaultMessage="Please deploy the Cloudflare Worker first. Enter the Worker URL, click Login, and copy the returned JSON."
              />
            }
            type="info"
          />
        </Form.Item>
        <Form.Item label="Worker URL">
          {getFieldDecorator('workerUrl', {
            initialValue: initData.workerUrl,
            rules: [
              {
                required: true,
                message: 'Worker URL is required!',
              },
              {
                type: 'url',
                message: 'Invalid URL format',
              }
            ],
          })(<Input disabled={editMode || verified} placeholder="https://your-worker.workers.dev" />)}
        </Form.Item>
        <Form.Item label="Action">
          <Button type="primary" onClick={this.handleLogin} disabled={!workerUrl}>
            <FormattedMessage id="backend.services.feishu.form.login" defaultMessage="Login to Feishu" />
          </Button>
        </Form.Item>
        <Form.Item label="Token JSON">
          <Input.TextArea
            rows={4}
            placeholder='Paste the JSON response from Worker here: {"access_token": "...", "refresh_token": "..."}'
            onChange={(e) => {
              try {
                const data = JSON.parse(e.target.value);
                if (data.access_token && data.refresh_token) {
                  const expiresAt = Math.floor(Date.now() / 1000) + (Number(data.expires_in) || 7200);

                  // Set fields silently
                  this.props.form.setFieldsValue({
                    'accessToken': data.access_token,
                    'refreshToken': data.refresh_token,
                    'expiresAt': expiresAt
                  });
                }
              } catch (err) {
                // Ignore parse error, maybe user is typing manual token
              }
            }}
          />
        </Form.Item>
        {/* Hidden fields to store parsed values */}
        <Form.Item style={{ display: 'none' }}>
          {getFieldDecorator('accessToken', {
            initialValue: initData.accessToken,
            rules: [{ required: true, message: 'Access Token is required' }]
          })(<Input />)}
        </Form.Item>
        <Form.Item style={{ display: 'none' }}>
          {getFieldDecorator('refreshToken', { initialValue: initData.refreshToken })(<Input />)}
        </Form.Item>
        <Form.Item style={{ display: 'none' }}>
          {getFieldDecorator('expiresAt', { initialValue: initData.expiresAt })(<Input />)}
        </Form.Item>
      </Fragment>
    );
  }
}

