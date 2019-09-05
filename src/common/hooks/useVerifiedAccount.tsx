import { Repository, UserInfo } from 'common/backend';
import { UserPreferenceStore } from '@/common/types';
import { FormComponentProps } from 'antd/lib/form';
import React, { useState } from 'react';
import { omit } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { message } from 'antd';

const useVerifiedAccount = ({
  form,
  services,
  initAccount,
}: FormComponentProps & { services: UserPreferenceStore['servicesMeta']; initAccount?: any }) => {
  const [type, _setType] = useState<string>(
    initAccount ? initAccount.type : Object.values(services)[0].type
  );
  const service = services[type];

  const changeType = (type: string) => {
    _setType(type);
    const values = form.getFieldsValue();
    form.resetFields(Object.keys(omit(values, ['type'])));
  };

  const [accountStatus, setAccountStatus] = useState<{
    repositories: Repository[];
    verified: boolean;
    userInfo?: UserInfo;
  }>({
    repositories: [],
    verified: false,
  });

  const [verifying, setVerifying] = useState(false);

  const doVerifyAccount = async (info: any) => {
    const Service = service.service;
    const instance = new Service(info);
    try {
      setVerifying(true);
      const userInfo = await instance.getUserInfo();
      const repositories = await instance.getRepositories();
      setAccountStatus({
        repositories,
        verified: true,
        userInfo,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setVerifying(false);
    }
  };

  const verifyAccount = () => {
    if (initAccount) {
      doVerifyAccount(initAccount);
      return;
    }
    form.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      const { type, defaultRepositoryId, imageHosting, ...info } = values;
      doVerifyAccount(info);
    });
  };

  let serviceForm;
  if (service.form) {
    if (initAccount) {
      const { type, ...info } = initAccount;
      serviceForm = <service.form form={form} verified={accountStatus.verified} info={info} />;
    } else {
      serviceForm = <service.form form={form} verified={accountStatus.verified} />;
    }
  }

  const okText = accountStatus.verified ? (
    <FormattedMessage id="preference.accountList.add" defaultMessage="Add" />
  ) : (
    <FormattedMessage id="preference.accountList.verify" defaultMessage="Verify" />
  );

  let oauthLink;
  if (service.oauthUrl) {
    oauthLink = (
      <a href={service.oauthUrl} target="_blank">
        <FormattedMessage id="preference.accountList.login" defaultMessage="Login" />
      </a>
    );
  }

  return {
    type,
    service,
    accountStatus,
    verifying,
    verifyAccount,
    changeType,
    serviceForm,
    okText,
    oauthLink,
  };
};
export default useVerifiedAccount;
