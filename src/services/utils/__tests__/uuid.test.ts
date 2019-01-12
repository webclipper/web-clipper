/**
 * @jest-environment jsdom
 */
import { UUID } from '../uuid';

describe('测试 UUID 工具', function() {
  it('测试 UUID 工具', function() {
    const uuid = UUID.UUID();
    expect(uuid.length).toBe(36);
  });
});
