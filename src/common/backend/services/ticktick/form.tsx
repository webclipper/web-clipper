import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment } from 'react';
import PowerpackForm from '@/components/powerpackForm';

const ConfigForm: React.FC<FormComponentProps> = ({ form }) => {
  return (
    <Fragment>
      <PowerpackForm form={form} />
    </Fragment>
  );
};

export default ConfigForm;
