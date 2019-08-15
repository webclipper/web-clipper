import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Component, Fragment } from 'react';
import { GithubBackendServiceConfig } from './interface';
import { FormattedMessage } from 'react-intl';

interface GithubFormProps {
  verified?: boolean;
  info?: GithubBackendServiceConfig;
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
                message: (
                  <FormattedMessage
                    id="backend.services.github.accessToken.message"
                    defaultMessage="AccessToken is required"
                  ></FormattedMessage>
                ),
              },
            ],
          })(<Input disabled={disabled} />)}
        </Form.Item>
      </Fragment>
    );
  }
}
