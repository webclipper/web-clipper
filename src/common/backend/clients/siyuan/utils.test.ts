import { describe, test, expect } from 'vitest';
import {
  DEFAULT_SIYUAN_BASE_URL,
  getSiyuanAccountId,
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

describe('思源账号标识', () => {
  test('默认地址与 localhost 保留旧账号 ID', () => {
    expect(getSiyuanAccountId()).toBe('siyuan');
    expect(getSiyuanAccountId('127.0.0.1:6806')).toBe('siyuan');
    expect(getSiyuanAccountId('http://localhost:6806/')).toBe('siyuan');
  });
  test('不同服务可共存，同一服务的等价地址不会重复添加', () => {
    expect(getSiyuanAccountId('192.168.1.10:6806')).not.toBe(getSiyuanAccountId('192.168.1.11:6806'));
    expect(getSiyuanAccountId(' HTTPS://EXAMPLE.COM:443/siyuan/// ')).toBe(getSiyuanAccountId('https://example.com/siyuan/'));
    expect(getSiyuanAccountId('https://example.com/a/')).not.toBe(getSiyuanAccountId('https://example.com/b/'));
  });
  test('拒绝无法用于 API 拼接的查询参数和非 HTTP 地址', () => {
    expect(() => normalizeSiyuanBaseUrl('https://example.com/?key=1')).toThrow();
    expect(() => normalizeSiyuanBaseUrl('ftp://example.com')).toThrow();
  });
});
