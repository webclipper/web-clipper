import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Checkbox } from 'antd';
import { FormattedMessage } from 'react-intl';
import localeService from '@/common/locales';

export default ({ form: { getFieldDecorator } }: FormComponentProps) => (
  <Form.Item wrapperCol={{ span: 17, offset: 6 }}>
    {getFieldDecorator('agreement', {
      initialValue: true,
      valuePropName: 'checked',
      rules: [
        {
          validator: (_rule, value, callback) => {
            if (!value) {
              callback(
                localeService.format({
                  id: 'backend.imageHosting.yuque.agreement.message',
                  defaultMessage: 'Need Checked',
                })
              );
            }
            callback();
          },
        },
      ],
    })(
      <Checkbox>
        <FormattedMessage
          id="backend.imageHosting.yuque.check"
          defaultMessage="Allow Webclipper use my Cookies of Yuque"
        ></FormattedMessage>
      </Checkbox>
    )}
  </Form.Item>
);
