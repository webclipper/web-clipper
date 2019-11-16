import { Form, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment } from 'react';

const HeaderForm: React.FC<FormComponentProps> = ({ form: { getFieldDecorator } }) => {
  return (
    <Fragment>
      <Form.Item>
        {getFieldDecorator('tags')(
          <Select mode="tags" style={{ width: '100%' }} placeholder={'Add tags'} />
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
