type TBasicManifest = {
  version: string;
  name: string;
};

export function getBasicManifest(): TBasicManifest;

export function isBeta(): boolean;

type GenerateManifestOptions = {
  publishToStore: boolean;
  basicManifest: TBasicManifest;
  targetBrowser: 'Chrome' | 'Firefox';
};

export function generateManifest(options: GenerateManifestOptions): TBasicManifest;
