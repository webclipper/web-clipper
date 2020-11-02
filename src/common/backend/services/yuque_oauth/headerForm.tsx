import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import locales from '@/common/locales';

const HeaderForm: React.FC<FormComponentProps> = ({ form: { getFieldDecorator } }) => {
  return (
    <Fragment>
      <Form.Item>
        {getFieldDecorator('slug', {
          rules: [
            {
              pattern: /^[\w-.]{2,190}$/,
              message: locales.format({
                id: 'backend.services.yuque.headerForm.slug_error',
                defaultMessage:
                  'The slug cannot be empty. Only letters, numbers, hyphen, underscore and dot are allowed. At least three characters.',
              }),
            },
          ],
        })(
          <Input
            autoComplete="off"
            placeholder={locales.format({
              id: 'backend.services.yuque.headerForm.slug',
              defaultMessage: 'Slug',
            })}
          ></Input>
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
