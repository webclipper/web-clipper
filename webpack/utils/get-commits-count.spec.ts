const getCommitsCount = require('./get-commits-count');

it('test getCommitsCount', () => {
  expect(typeof getCommitsCount()).toEqual('number');

  expect(getCommitsCount() > 1000).toBeTruthy();
});
