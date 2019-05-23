import axios from 'axios';

export function hasUpdate(remote: string, local: string): boolean {
  const remoteVersion = remote.split('.').map(version => parseInt(version, 10));
  const localVersion = local.split('.').map(version => parseInt(version, 10));
  for (let i = 0; i < remoteVersion.length; i++) {
    if (remoteVersion[i] > localVersion[i]) {
      return true;
    }
    if (remoteVersion[i] < localVersion[i]) {
      return false;
    }
  }
  return false;
}

export async function getRemoteVersion() {
  const packageJson = await axios.get(
    'https://raw.githubusercontent.com/webclipper/web-clipper/master/package.json'
  );
  return packageJson.data.version;
}

export async function getCurrentVersion() {
  return chrome.runtime.getManifest().version;
}
