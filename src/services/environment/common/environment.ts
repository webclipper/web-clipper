import { Token } from 'typedi';

export const IEnvironmentService = new Token<IEnvironmentService>();

export interface IEnvironmentService {
  privacy(): Promise<string>;
  changelog(): Promise<string>;
}
