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
  const withProtocol = /^https?:\/\//i.test(input) ? input : `http://${input}`;
  return `${withProtocol.replace(/\/+$/, '')}/`;
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
