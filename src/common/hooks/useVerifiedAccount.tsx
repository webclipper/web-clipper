import { UserPreferenceStore } from '@/common/types';
import { FormComponentProps } from 'antd/lib/form';
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { omit, isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import useAsync from './useAsync';

type UseVerifiedAccountProps = FormComponentProps & {
  services: UserPreferenceStore['servicesMeta'];
  initAccount?: any;
};

function useDeepCompareMemoize<T>(value: T) {
  const ref = React.useRef<T>();
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

const useVerifiedAccount = ({ form, services, initAccount }: UseVerifiedAccountProps) => {
  const [type, _setType] = useState<string>(
    initAccount ? initAccount.type : Object.values(services)[0].type
  );
  const service = services[type];
  const changeType = (type: string) => {
    _setType(type);
    const values = form.getFieldsValue();
    form.resetFields(Object.keys(omit(values, ['type'])));
  };
  const { result, run, loading } = useAsync(
    async (info: any) => {
      const Service = service.service;
      const instance = new Service(info);
      const userInfo = await instance.getUserInfo();
      const repositories = await instance.getRepositories();
      return { userInfo, repositories };
    },
    [service],
    {
      manual: true,
    }
  );

  let loadAccount = useCallback(() => {
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const { type, defaultRepositoryId, imageHosting, ...info } = values;
      run(info);
    });
  }, [form, run]);

  const accountStatus = {
    repositories: result ? result.repositories : [],
    userInfo: result ? result.userInfo : null,
    verified: !!result && !loading,
  };

  let serviceForm = useMemo(() => {
    if (!service.form) {
      return null;
    }
    return (
      <service.form
        form={form}
        verified={accountStatus.verified}
        info={initAccount}
        loadAccount={loadAccount}
      />
    );
  }, [accountStatus.verified, form, initAccount, loadAccount, service.form]);

  const okText = useMemo(() => {
    return accountStatus.verified ? (
      <FormattedMessage id="preference.accountList.add" defaultMessage="Add" />
    ) : (
      <FormattedMessage id="preference.accountList.verify" defaultMessage="Verify" />
    );
  }, [accountStatus.verified]);

  let oauthLink = useMemo(() => {
    return service.oauthUrl ? (
      <a href={service.oauthUrl} target="_blank">
        <FormattedMessage id="preference.accountList.login" defaultMessage="Login" />
      </a>
    ) : null;
  }, [service.oauthUrl]);

  const _formInfo = useMemo(() => {
    const values = form.getFieldsValue();
    const { defaultRepositoryId, type: curT, imageHosting, ...info } = values;
    if (type !== curT) {
      return null;
    }
    return info;
  }, [form, type]);

  const formInfo = useDeepCompareMemoize(_formInfo);
  const verifiedRef = useRef(accountStatus.verified);
  verifiedRef.current = accountStatus.verified;

  useEffect(() => {
    if (!verifiedRef.current || !formInfo) {
      return;
    }
    run(formInfo);
  }, [verifiedRef, formInfo, run]);

  return {
    type,
    service,
    accountStatus: accountStatus,
    verifying: loading,
    verifyAccount: run,
    loadAccount,
    changeType,
    serviceForm,
    okText,
    oauthLink,
  };
};
export default useVerifiedAccount;
