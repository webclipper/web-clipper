import { GithubClient } from './client';

describe('test GithubClient', () => {
  test('test generateNewTokenUrl', () => {
    expect(GithubClient.generateNewTokenUrl).toEqual(
      'https://github.com/settings/tokens/new?scopes=repo&description=Web%20Clipper'
    );
  });
});
