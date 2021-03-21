export interface BaklibBackendServiceConfig {
  accessToken: string;
  origin: string;
}

export interface BaklibTenantsResponse {
  current_tenants: { id: string; name: string; member_role: string[] }[];
  share_tenants: { id: string; name: string; member_role: string[] }[];
}
