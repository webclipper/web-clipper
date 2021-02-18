import { Token } from 'typedi';

export interface IUserPreference {
  iconColor: 'dark' | 'light' | 'auto';
}

export interface IPreferenceService {
  userPreference: IUserPreference;
  init: () => Promise<void>;
}

export const IPreferenceService = new Token<IPreferenceService>();
