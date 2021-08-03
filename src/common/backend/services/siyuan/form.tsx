import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import localeService from '@/common/locales';

interface SiyuanFormProps {
  info?: SiyuanBackendServiceConfig;
}

interface SiyuanBackendServiceConfig {
  accessToken?: string;
}

const form: React.FC<FormComponentProps & SiyuanFormProps> = props => {
  const {
    form: { getFieldDecorator },
    info,
  } = props;

  let initData: Partial<SiyuanBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
  return (
    <Fragment>
      <Form.Item
        label={localeService.format({
          id: 'backend.services.siyuan.form.accessToken',
        })}
      >
        {getFieldDecorator('accessToken', {
          initialValue: initData.accessToken,
        })(<Input disabled={editMode} />)}
      </Form.Item>
    </Fragment>
  );
};

export default form;
