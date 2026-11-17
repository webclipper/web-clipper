import React from 'react';
import { renderToString } from 'react-dom/server';
import { vi, test, expect } from 'vitest';
import useOriginForm from './useOriginForm';
import { normalizeSiyuanBaseUrl } from '@/common/backend/clients/siyuan/utils';

const { request } = vi.hoisted(() => ({ request: vi.fn(async () => true) }));
vi.mock('@/common/hooks/useOriginPermission', () => ({ default: () => [false, request] }));

test('思源表单先补全协议，校验与授权使用同一地址', async () => {
  const form = { setFieldsValue: vi.fn() };
  let hook: ReturnType<typeof useOriginForm>;
  function Harness() {
    hook = useOriginForm({ form: form as any, initStatus: false, normalizeOrigin: normalizeSiyuanBaseUrl });
    return null;
  }
  renderToString(<Harness />);
  const callback = vi.fn();
  hook!.formRules[1].validator!({}, '192.168.1.10:6806', callback);
  expect(callback.mock.calls).toEqual([[]]);
  expect(form.setFieldsValue).toHaveBeenCalledWith({ origin: 'http://192.168.1.10:6806/' });
  await hook!.requestOriginPermission('192.168.1.10:6806');
  expect(request).toHaveBeenCalledWith('http://192.168.1.10:6806/');
});
