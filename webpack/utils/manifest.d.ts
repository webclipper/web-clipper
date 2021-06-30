type TBasicManifest = {
  version: string;
  name: string;
};

export function getBasicManifest(): TBasicManifest;

export function isBeta(): boolean;
