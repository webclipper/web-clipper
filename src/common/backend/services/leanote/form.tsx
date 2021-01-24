import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import { LeanoteBackendServiceConfig } from '../../clients/leanote/interface';
import { FormattedMessage } from 'react-intl';
import i18n from '@/common/locales';

interface OneNoteProps {
  verified?: boolean;
  info?: LeanoteBackendServiceConfig;
}

const ExtraForm: React.FC<OneNoteProps & FormComponentProps> = props => {
  const {
    form: { getFieldDecorator },
    info,
    verified,
  } = props;

  let initData: Partial<LeanoteBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
  return (
    <Fragment>
      <Form.Item
        label={
          <FormattedMessage
            id="backend.services.leanote.form.leanote_host"
            defaultMessage="Leanote host"
          />
        }
      >
        {getFieldDecorator('leanote_host', {
          initialValue: initData.leanote_host,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.leanote.form.leanote_host',
                defaultMessage: 'Leanote instance url is required eg. https://leanote.com',
              }),
            },
          ],
        })(<Input disabled={editMode || verified} />)}
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="backend.services.leanote.form.email" defaultMessage="email" />}
      >
        {getFieldDecorator('email', {
          initialValue: initData.email,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.leanote.form.email',
                defaultMessage: 'Email is required.',
              }),
            },
          ],
        })(<Input disabled={editMode || verified} />)}
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="backend.services.leanote.form.pwd" defaultMessage="pwd" />}
      >
        {getFieldDecorator('pwd', {
          initialValue: initData.pwd,
        })(<Input disabled={editMode || verified} />)}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage
            id="backend.services.leanote.form.token"
            defaultMessage="token_cached"
          />
        }
      >
        {getFieldDecorator('token_cached', {
          initialValue: initData.token_cached,
        })(<Input disabled={editMode || verified} />)}
      </Form.Item>
    </Fragment>
  );
};

export default ExtraForm;
