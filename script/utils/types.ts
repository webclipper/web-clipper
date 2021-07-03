export type TBuildTarget = 'Chrome' | 'Firefox';
export type TDistType = 'Beta' | 'Release';

export interface IReleaseProcessEnv {
  TARGET_BROWSER?: TBuildTarget;
  PUBLISH_TO_STORE?: 'true';
  DIST_TYPE?: TDistType;
}

export interface IWebpackProcessEnv {
  TARGET_BROWSER: TBuildTarget;
  PUBLISH_TO_STORE?: 'true';
  NODE_ENV: 'development' | 'production';
}

export interface IBuildOptions {
  targetBrowser: Set<TBuildTarget>;
  publishToStore: boolean;
  distType: Set<TDistType>;
}
