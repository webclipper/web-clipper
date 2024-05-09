import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import i18n from '@/common/locales';
import useOriginForm from '@/hooks/useOriginForm';
import { WordPressServiceConfig } from '.';

interface OneNoteProps {
  verified?: boolean;
  info?: WordPressServiceConfig;
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
    originKey: 'host',
  });
  let initData: Partial<WordPressServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
  return (
    <Fragment>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.wordpress.form.origin" defaultMessage="Origin" />
        }
      >
        {form.getFieldDecorator('host', {
          initialValue: info?.host,
          rules: formRules,
        })(
          <Input.Search
            enterButton={
              <FormattedMessage
                id="backend.services.wordpress.form.authentication"
                defaultMessage="Authentication"
              />
            }
            onSearch={handleAuthentication}
            disabled={verified}
          />
        )}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.wordpress.form.username" defaultMessage="Email" />
        }
      >
        {getFieldDecorator('username', {
          initialValue: initData.username,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.wordpress.form.username',
                defaultMessage: 'Username is required.',
              }),
            },
          ],
        })(<Input disabled={editMode} />)}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.wordpress.form.pwd" defaultMessage="Password" />
        }
      >
        {getFieldDecorator('pwd', {
          initialValue: initData.pwd,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.wordpress.form.pwd',
                defaultMessage: 'Password is required.',
              }),
            },
          ],
        })(<Input disabled={editMode} type="password" />)}
      </Form.Item>
    </Fragment>
  );
};

export default ExtraForm;
