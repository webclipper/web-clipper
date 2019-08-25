import { AccountPreference } from '@/common/types';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('account');

export const asyncAddAccount = actionCreator.async<
  {
    info: any;
    imageHosting?: string;
    defaultRepositoryId?: string;
    userInfo: any;
    type: string;
    callback(): void;
  },
  {
    accounts: AccountPreference[];
    defaultAccountId: string;
  },
  void
>('asyncAddAccount');

export const initAccounts = actionCreator.async<
  void,
  { accounts: AccountPreference[]; defaultAccountId: string }
>('initAccounts');

export const asyncDeleteAccount = actionCreator.async<
  { id: string },
  {
    accounts: AccountPreference[];
    defaultAccountId: string;
  },
  void
>('asyncDeleteAccount');

export const asyncUpdateCurrentAccountId = actionCreator.async<{ id?: string }, void>(
  'asyncUpdateCurrentAccountId'
);

export const asyncUpdateAccount = actionCreator<{
  id: string;
  account: {
    info: any;
    imageHosting?: string;
    defaultRepositoryId?: string;
    type: string;
  };
  callback(): void;
}>('asyncUpdateAccount');
