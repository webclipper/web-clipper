/**
 * @jest-environment jsdom
 */
import { gzip, ungzip } from './index';

it('test gzip and ungzip', () => {
  expect(ungzip(gzip('111'))).toEqual('111');
});
