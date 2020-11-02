import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input, Select } from 'antd';
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

const DomainList = ['@kindle.cn', '@kindle.com', '@free.kindle.com'];

const DomainSelect = (
  <Select style={{ width: 150 }}>
    {DomainList.map(o => (
      <Select.Option key={o} value={o}>
        {o}
      </Select.Option>
    ))}
  </Select>
);

const ExtraForm: React.FC<OneNoteProps & FormComponentProps> = props => {
  const {
    form,
    form: { getFieldDecorator },
    info,
  } = props;

  let initData: Partial<MailBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  return (
    <Fragment>
      <PowerpackForm form={form} />
      <Form.Item
        label={
          <FormattedMessage id="backend.services.kindle.form.send.to" defaultMessage="Send to" />
        }
      >
        {getFieldDecorator('to', {
          initialValue: initData.to,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.kindle.form.address.is.required',
                defaultMessage: 'Mail Address is required.',
              }),
            },
          ],
        })(
          <Input
            addonAfter={getFieldDecorator('domain', {
              initialValue: initData.domain || '@kindle.com',
            })(DomainSelect)}
          />
        )}
        <p style={{ lineHeight: '30px' }}>
          <FormattedMessage
            id="backend.services.kindle.form.alert"
            defaultMessage="You must tell Amazon allow {mail} send email to your kindle."
            values={{
              mail: (
                <span style={{ fontWeight: 500, display: 'block' }}>
                  send_to_kindle@push.clipper.website
                </span>
              ),
            }}
          />
        </p>
      </Form.Item>
    </Fragment>
  );
};

export default ExtraForm;
