import { removeEmptyKeys } from './interface';

it('test remove PR_IS_WELCOME', () => {
  const messages = {
    a: '1',
    b: '',
    c: '',
  };

  expect(removeEmptyKeys(messages, { b: '2' })).toEqual({
    a: '1',
    b: '2',
  });
});
