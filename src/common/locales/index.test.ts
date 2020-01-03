import { removeEmptyKeys } from './interface';

it('test remove PR_IS_WELCOME', () => {
  const messages = {
    a: '1',
    b: 'PR_IS_WELCOME',
  };

  expect(removeEmptyKeys(messages)).toEqual({
    a: '1',
  });
});
