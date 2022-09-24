export interface ObsidianBackendServiceConfig {
  accessToken: string;
  /**
   * @default http://127.0.0.1:27123
   */
  endPoint?: string;
  directory?: string;
}
