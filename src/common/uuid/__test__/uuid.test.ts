/**
 * @jest-environment jsdom
 */
import { generateUuid } from '../index';

describe('test uuid', function() {
  it('test generateUuid', function() {
    expect(generateUuid().length).toBe(36);
  });
});
