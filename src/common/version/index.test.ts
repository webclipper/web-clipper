import { hasUpdate } from './index';

describe('test version', function() {
  it('test hasUpdate', function() {
    expect(hasUpdate('3.0.1', '3.0.0')).toBe(true);
    expect(hasUpdate('3.1.1', '3.0.1')).toBe(true);
    expect(hasUpdate('3.0.0', '2.0.0')).toBe(true);
    expect(hasUpdate('3.0.0', '3.0.0')).toBe(false);
    expect(hasUpdate('3.0.0', '4.0.0')).toBe(false);
  });
});
