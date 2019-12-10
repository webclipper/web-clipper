export interface AccountPreference {
  [key: string]: string | undefined;
  id: string;
  type: string;
  name: string;
  avatar: string;
  homePage: string;
  description?: string;
  defaultRepositoryId?: string;
  imageHosting?: string;
}

export interface AccountStore {
  currentAccountId?: string;
  defaultAccountId?: string;
  accounts: AccountPreference[];
}
