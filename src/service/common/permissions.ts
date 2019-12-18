import { Token } from 'typedi';

export interface Permissions {
  origins?: string[];

  permissions?: string[];
}

export interface IPermissionsService {
  contains(permissions: Permissions): Promise<boolean>;

  request(permissions: Permissions): Promise<boolean>;

  remove(permissions: Permissions): Promise<boolean>;
}

export const IPermissionsService = new Token<IPermissionsService>();
