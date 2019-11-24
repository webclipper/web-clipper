import { AccountPreference } from './modelTypes/account';

export function unpackAccountPreference(account: AccountPreference) {
  const {
    id,
    type,
    defaultRepositoryId,
    imageHosting,
    name,
    avatar,
    description,
    homePage,
    ...info
  } = account;
  return {
    id,
    account: {
      type,
      defaultRepositoryId,
      imageHosting,
      info,
    },
    userInfo: {
      name,
      avatar,
      description,
      homePage,
    },
  };
}
