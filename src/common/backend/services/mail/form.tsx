import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input, Checkbox } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import { MailBackendServiceConfig } from './interface';
import { FormattedMessage } from 'react-intl';
import i18n from '@/common/locales';
import PowerpackForm from '@/components/powerpackForm';

interface OneNoteProps {
  verified?: boolean;
  info?: MailBackendServiceConfig;
}

const ExtraForm: React.FC<OneNoteProps & FormComponentProps> = props => {
  const {
    form,
    form: { getFieldDecorator },
    info,
    verified,
  } = props;

  let initData: Partial<MailBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
  return (
    <Fragment>
      <PowerpackForm form={form} />
      <Form.Item
        label={
          <FormattedMessage id="backend.services.mail.form.send.to" defaultMessage="Send to" />
        }
      >
        {getFieldDecorator('to', {
          initialValue: initData.to,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.mail.form.address.is.required',
                defaultMessage: 'Mail Address is required.',
              }),
            },
          ],
        })(<Input disabled={editMode || verified} />)}
      </Form.Item>
      <Form.Item
        label="&nbsp;"
        extra={
          <FormattedMessage
            id="backend.services.mail.form.send.html.or.markdown"
            defaultMessage="Send Html or Markdown."
          />
        }
        colon={false}
      >
        {getFieldDecorator('html', {
          initialValue: initData.html,
          valuePropName: 'checked',
        })(
          <Checkbox>
            <FormattedMessage
              id="backend.services.mail.form.send.html"
              defaultMessage="Send Html"
            />
          </Checkbox>
        )}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.mail.form.homepage" defaultMessage="Homepage" />
        }
      >
        {getFieldDecorator('home', {
          initialValue: initData.home,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.mail.form.homepage.is.required',
                defaultMessage: 'Homepage is required',
              }),
            },
          ],
        })(
          <Input
            placeholder={i18n.format({
              id: 'backend.services.mail.form.homepage.of.mail',
              defaultMessage: 'Homepage of Mail',
            })}
          />
        )}
      </Form.Item>
    </Fragment>
  );
};

export default ExtraForm;
