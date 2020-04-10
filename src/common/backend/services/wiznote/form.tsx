import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { WizNoteConfig } from '@/common/backend/services/wiznote/interface';
import { FormattedMessage } from 'react-intl';
import useOriginForm from '@/hooks/useOriginForm';

interface WizNoteFormProps extends FormComponentProps {
  info?: WizNoteConfig;
}

const WizNoteForm: React.FC<WizNoteFormProps> = ({ form, info }) => {
  const { verified, handleAuthentication, formRules } = useOriginForm({ form, initStatus: !!info });
  return (
    <React.Fragment>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.wiznote.form.origin" defaultMessage="Origin" />
        }
      >
        {form.getFieldDecorator('origin', {
          initialValue: info?.origin,
          rules: formRules,
        })(
          <Input.Search
            enterButton={
              <FormattedMessage
                id="backend.services.wiznote.form.authentication"
                defaultMessage="Authentication"
              />
            }
            onSearch={handleAuthentication}
            disabled={verified}
          />
        )}
      </Form.Item>
    </React.Fragment>
  );
};

export default WizNoteForm;
