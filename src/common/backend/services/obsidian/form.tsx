import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { ObsidianBackendServiceConfig } from './interface';

interface FormProps extends FormComponentProps {
  verified?: boolean;
  info?: ObsidianBackendServiceConfig;
}

const ConfigForm: React.FC<FormProps> = ({ form: { getFieldDecorator }, info, verified }) => {
  const disabled = verified || !!info;

  return (
    <Fragment>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.obsidian.localRestToken" defaultMessage="Token" />
        }
      >
        {getFieldDecorator('accessToken', {
          initialValue: info?.accessToken,
          rules: [
            {
              required: true,
              message: (
                <FormattedMessage
                  id="backend.services.obsidian.localRestToken.message"
                  defaultMessage="please enter token"
                />
              ),
            },
          ],
        })(<Input disabled={disabled} />)}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.obsidian.endpoint" defaultMessage="Api endpoint" />
        }
      >
        {getFieldDecorator('endpoint', {
          initialValue: info?.endPoint,
          rules: [
            {
              required: false,
              message: (
                <FormattedMessage
                  id="backend.services.obsidian.endpoint.message"
                  defaultMessage="please enter endpoint"
                />
              ),
            },
          ],
        })(<Input placeholder="http://127.0.0.1:27123" />)}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage
            id="backend.services.obsidian.saveDirectory"
            defaultMessage="Save Directory"
          />
        }
      >
        {getFieldDecorator('directory', {
          initialValue: info?.directory,
        })(<Input />)}
      </Form.Item>
    </Fragment>
  );
};

export default ConfigForm;
