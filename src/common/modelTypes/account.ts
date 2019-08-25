export interface AccountPreference {
  id: string;
  type: string;
  name: string;
  avatar: string;
  homePage: string;
  description?: string;
  defaultRepositoryId?: string;
  imageHosting?: string;
  [key: string]: string | undefined;
}

export interface AccountStore {
  currentAccountId?: string;
  defaultAccountId?: string;
  accounts: AccountPreference[];
}
