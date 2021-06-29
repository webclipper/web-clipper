const generateVersion = require('./version');

it('test pre-release', () => {
  expect(generateVersion({ version: '1.31.0-alpha.0', commitsCount: 100 })).toEqual('1.30.100');
});

it('test normal', () => {
  expect(generateVersion({ version: '1.31.0', commitsCount: 100 })).toEqual('1.31.0');
});
