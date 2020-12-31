import pako from 'pako';

function gzip(data: string): string {
  return pako.gzip(data, { to: 'string' });
}

function ungzip(data: string): string {
  return pako.ungzip(data, { to: 'string' });
}

export { gzip, ungzip };
