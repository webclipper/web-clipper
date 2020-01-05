import { Token } from 'typedi';
export interface PowerpackUserInfo {
  name: string;
  email: string;
  avatar_url: string;
  expire_date: string;
}

export interface IPowerpackService {
  userInfo: PowerpackUserInfo | null;
  accessToken?: string;
  bought: boolean;
  expired: boolean;

  startup(): Promise<void>;
  logout(): Promise<void>;
  refresh(): Promise<void>;
  login(token: string): Promise<void>;
}

export const IPowerpackService = new Token<IPowerpackService>();
