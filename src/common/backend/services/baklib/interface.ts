export enum RepositoryType {
  all = 'all',
  self = 'self',
  group = 'group',
}

export interface BaklibBackendServiceConfig {
  accessToken: string;
}

export interface BaklibTenantsResponse {
  current_tenants: { id: string; name: string; member_role: string[] }[];
  share_tenants: { id: string; name: string; member_role: string[] }[];
}
