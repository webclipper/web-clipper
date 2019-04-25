export * from './imageHosting/interface';
export * from './services/interface';

export interface Repository {
  id: string;
  name: string;
  private: boolean;
  createdAt: string;
  owner: string;
  /**
   * namespace = owner/name
   */
  namespace: string;
}
