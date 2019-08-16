export function hasUpdate(remote: string, local: string): boolean {
  if (!remote) {
    return false;
  }
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
