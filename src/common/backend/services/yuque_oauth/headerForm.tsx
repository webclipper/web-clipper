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
              }),
            },
          ],
        })(
          <Input
            autoComplete="off"
            placeholder={locales.format({
              id: 'backend.services.yuque.headerForm.slug',
            })}
          ></Input>
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
