import md5 from '@web-clipper/shared/lib/md5';

/**
 * 思源笔记内核默认只监听本机 127.0.0.1:6806，
 * 这里的默认值仅作为未填写接口地址时的兜底。
 */
export const DEFAULT_SIYUAN_BASE_URL = 'http://127.0.0.1:6806/';

/**
 * 本地内核与默认地址对应的 manifest 匹配模式
 */
export const DEFAULT_SIYUAN_PERMISSION_ORIGINS = [
  'http://localhost:6806/*',
  'http://127.0.0.1:6806/*',
];

/**
 * 把用户填写的接口地址规整成可以直接拼接 `api/xxx` 的 baseURL。
 * 例如：`http://192.168.1.10:6806` -> `http://192.168.1.10:6806/`
 */
export const normalizeSiyuanBaseUrl = (origin?: string): string => {
  const input = (origin || '').trim();
  if (!input) {
    return DEFAULT_SIYUAN_BASE_URL;
  }
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(input) && !/^https?:\/\//i.test(input)) {
    throw new Error('仅支持 HTTP 或 HTTPS 接口地址');
  }
  const withProtocol = /^https?:\/\//i.test(input) ? input : `http://${input}`;
  const url = new URL(withProtocol);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('请输入不含凭据、查询参数和片段的 HTTP 或 HTTPS 接口地址');
  }
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
  return url.href;
};

/**
 * 获取思源笔记需要的 host 权限匹配模式，包含自定义接口地址。
 */
export const getSiyuanPermissionOrigins = (origin?: string): string[] => {
  const origins = [...DEFAULT_SIYUAN_PERMISSION_ORIGINS];
  const customOrigin = `${normalizeSiyuanBaseUrl(origin).replace(/\/+$/, '')}/*`;
  if (!origins.includes(customOrigin)) {
    origins.push(customOrigin);
  }
  return origins;
};

// 默认本地服务保留旧 ID，远端服务按规范化地址区分。
export const getSiyuanAccountId = (origin?: string): string => {
  const baseUrl = normalizeSiyuanBaseUrl(origin);
  if (baseUrl === DEFAULT_SIYUAN_BASE_URL || baseUrl === 'http://localhost:6806/') {
    return 'siyuan';
  }
  return `siyuan:${md5(baseUrl)}`;
};
