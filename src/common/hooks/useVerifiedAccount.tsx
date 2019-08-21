import { Repository, UserInfo } from 'common/backend';
import { UserPreferenceStore } from '@/common/types';
import { FormComponentProps } from 'antd/lib/form';
import React, { useState } from 'react';
import { omit } from 'lodash';
import { FormattedMessage } from 'react-intl';

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

  const doVerifyAccount = async (info: any) => {
    const Service = service.service;
    const instance = new Service(info);
    const userInfo = await instance.getUserInfo();
    const repositories = await instance.getRepositories();
    setAccountStatus({
      repositories,
      verified: true,
      userInfo,
    });
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
    <FormattedMessage id="preference.accountList.bind" defaultMessage="Bind" />
  ) : (
    <FormattedMessage id="preference.accountList.ok" defaultMessage="Ok" />
  );

  let oauthLink;
  if (service.oauthUrl) {
    oauthLink = (
      <a href={service.oauthUrl} target="_blank">
        Bind
      </a>
    );
  }

  return {
    type,
    service,
    accountStatus,
    verifyAccount,
    changeType,
    serviceForm,
    okText,
    oauthLink,
  };
};
export default useVerifiedAccount;
