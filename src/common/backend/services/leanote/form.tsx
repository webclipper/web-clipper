import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import { LeanoteBackendServiceConfig } from '../../clients/leanote/interface';
import { FormattedMessage } from 'react-intl';
import i18n from '@/common/locales';
import useOriginForm from '@/hooks/useOriginForm';

interface OneNoteProps {
  verified?: boolean;
  info?: LeanoteBackendServiceConfig;
}

const ExtraForm: React.FC<OneNoteProps & FormComponentProps> = props => {
  const {
    form: { getFieldDecorator },
    form,
    info,
  } = props;
  const { verified, handleAuthentication, formRules } = useOriginForm({
    form,
    initStatus: !!info,
    originKey: 'leanote_host',
  });
  let initData: Partial<LeanoteBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
  return (
    <Fragment>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.confluence.form.origin" defaultMessage="Origin" />
        }
      >
        {form.getFieldDecorator('leanote_host', {
          initialValue: info?.leanote_host,
          rules: formRules,
        })(
          <Input.Search
            enterButton={
              <FormattedMessage
                id="backend.services.confluence.form.authentication"
                defaultMessage="Authentication"
              />
            }
            onSearch={handleAuthentication}
            disabled={verified}
          />
        )}
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="backend.services.leanote.form.email" defaultMessage="Email" />}
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
        })(<Input disabled={editMode} />)}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.leanote.form.pwd" defaultMessage="Password" />
        }
      >
        {getFieldDecorator('pwd', {
          initialValue: initData.pwd,
        })(<Input disabled={editMode} />)}
      </Form.Item>
    </Fragment>
  );
};

export default ExtraForm;
