import React from 'react';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Form } from '@ant-design/compatible';
import { FormattedMessage } from 'react-intl';
import { Checkbox, Button } from 'antd';
import usePowerpack from '@/common/hooks/usePowerpack';
import i18n from '@/common/locales';
interface PowerpackFormProps extends FormComponentProps {}

const PowerpackForm: React.FC<PowerpackFormProps> = ({ form: { getFieldDecorator } }) => {
  const { bought, boughtPowerpack, expired } = usePowerpack();

  return (
    <Form.Item
      label={
        <FormattedMessage id="backend.services.kindle.form.powerpack" defaultMessage="Powerpack" />
      }
    >
      {getFieldDecorator('powerpack', {
        initialValue: bought,
        valuePropName: 'checked',
        rules: [
          {
            validator(_r, _v, cb) {
              if (!bought) {
                return cb(
                  i18n.format({
                    id: 'component.powerpackForm.required',
                    defaultMessage: 'Powerpack is required.',
                  })
                );
              }

              if (expired) {
                return cb(
                  i18n.format({
                    id: 'component.powerpackForm.expired',
                    defaultMessage: 'Powerpack is expired',
                  })
                );
              }
              cb();
            },
          },
        ],
      })(
        <Checkbox disabled>
          <Button type="link" onClick={boughtPowerpack}>
            <FormattedMessage
              id="backend.services.kindle.form.buy.powerpack"
              defaultMessage="Buy Powerpack"
            />
          </Button>
        </Checkbox>
      )}
    </Form.Item>
  );
};
export default PowerpackForm;
