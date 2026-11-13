import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import localeService from '@/common/locales';
import useOriginForm from '@/hooks/useOriginForm';
import { ISiyuanBackendServiceConfig } from '../../clients/siyuan/types';
import { DEFAULT_SIYUAN_BASE_URL } from '../../clients/siyuan/utils';

interface SiyuanFormProps {
  verified?: boolean;
  loadAccount?: () => void;
  info?: ISiyuanBackendServiceConfig;
}

const form: React.FC<FormComponentProps & SiyuanFormProps> = props => {
  const {
    form,
    form: { getFieldDecorator },
    info,
    loadAccount,
  } = props;

  const { requestOriginPermission, formRules } = useOriginForm({
    form,
    initStatus: false,
  });

  /**
   * 思源笔记的接口地址允许自定义（例如远端的 http://192.168.1.10:6806），
   * 浏览器扩展需要单独申请该地址的 host 权限，授权成功后立即重新校验账号。
   */
  const handleAuthentication = () => {
    form.validateFields(['origin'], async (err, values) => {
      if (err) {
        return;
      }
      const granted = await requestOriginPermission(values.origin);
      if (granted && loadAccount) {
        loadAccount();
      }
    });
  };

  let initData: Partial<ISiyuanBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
  return (
    <Fragment>
      <Form.Item
        label={localeService.format({
          id: 'backend.services.siyuan.form.origin',
          defaultMessage: 'API address',
        })}
      >
        {getFieldDecorator('origin', {
          initialValue: initData.origin || DEFAULT_SIYUAN_BASE_URL,
          rules: formRules,
        })(
          <Input.Search
            placeholder={DEFAULT_SIYUAN_BASE_URL}
            enterButton={localeService.format({
              id: 'backend.services.siyuan.form.authentication',
              defaultMessage: 'Authorize',
            })}
            onSearch={handleAuthentication}
          />
        )}
      </Form.Item>
      <Form.Item
        label={localeService.format({
          id: 'backend.services.siyuan.form.accessToken',
          defaultMessage: 'Token',
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
