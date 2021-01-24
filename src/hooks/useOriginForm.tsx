import React from 'react';
import { FormattedMessage } from 'react-intl';
import useOriginPermission from '@/common/hooks/useOriginPermission';
import { FormComponentProps } from '@ant-design/compatible/lib/form';

interface UseOriginFormProps extends FormComponentProps {
  initStatus: boolean;
  originKey?: string;
}

const useOriginForm = ({ initStatus, form, originKey }: UseOriginFormProps) => {
  const key = originKey || 'origin';
  const [verified, requestOriginPermission] = useOriginPermission(initStatus);
  const handleAuthentication = () => {
    form.validateFields([key], async (err, value) => {
      if (err) {
        return;
      }
      requestOriginPermission(value[key]);
    });
  };
  const formRules = [
    {
      required: true,
      message: (
        <FormattedMessage
          id="hooks.useOriginForm.origin.message"
          defaultMessage={`Wrong format,Examples https://developer.mozilla.org`}
        />
      ),
    },
    {
      validator(_r: any, value: string, callback: Function) {
        if (!value) {
          return callback();
        }
        try {
          const _url = new URL(value);
          if (_url.origin !== value) {
            form.setFieldsValue({
              [key]: _url.origin,
            });
            callback();
          }
          callback();
        } catch (_error) {
          return callback(
            <FormattedMessage
              id="hooks.useOriginForm.origin.message"
              defaultMessage={`Wrong format,Examples https://developer.mozilla.org`}
            />
          );
        }
      },
    },
  ];
  return { verified, handleAuthentication, formRules };
};

export default useOriginForm;
