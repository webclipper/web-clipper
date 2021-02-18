import { Token } from 'typedi';

export type TIconColor = 'dark' | 'light' | 'auto';

export interface IUserPreference {
  iconColor: TIconColor;
}

export interface IPreferenceService {
  userPreference: IUserPreference;
  init: () => Promise<void>;

  updateIconColor(color: TIconColor): Promise<void>;
}

export const IPreferenceService = new Token<IPreferenceService>();
