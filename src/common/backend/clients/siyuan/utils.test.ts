import {
  DEFAULT_SIYUAN_BASE_URL,
  getSiyuanPermissionOrigins,
  normalizeSiyuanBaseUrl,
} from './utils';

describe('test siyuan utils', () => {
  test('use local kernel as fallback', () => {
    expect(normalizeSiyuanBaseUrl()).toEqual(DEFAULT_SIYUAN_BASE_URL);
    expect(normalizeSiyuanBaseUrl('   ')).toEqual(DEFAULT_SIYUAN_BASE_URL);
  });

  test('normalize custom origin', () => {
    expect(normalizeSiyuanBaseUrl('http://192.168.1.10:6806')).toEqual(
      'http://192.168.1.10:6806/'
    );
    expect(normalizeSiyuanBaseUrl('https://siyuan.example.com:6806/')).toEqual(
      'https://siyuan.example.com:6806/'
    );
    expect(normalizeSiyuanBaseUrl('192.168.1.10:6806')).toEqual('http://192.168.1.10:6806/');
  });

  test('permission origins contain custom origin', () => {
    const origins = getSiyuanPermissionOrigins('http://192.168.1.10:6806');
    expect(origins).toEqual([
      'http://localhost:6806/*',
      'http://127.0.0.1:6806/*',
      'http://192.168.1.10:6806/*',
    ]);
  });

  test('permission origins do not duplicate the local origin', () => {
    expect(getSiyuanPermissionOrigins('http://127.0.0.1:6806/')).toEqual([
      'http://localhost:6806/*',
      'http://127.0.0.1:6806/*',
    ]);
    expect(getSiyuanPermissionOrigins()).toEqual([
      'http://localhost:6806/*',
      'http://127.0.0.1:6806/*',
    ]);
  });
});
