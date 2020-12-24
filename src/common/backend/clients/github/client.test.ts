import { MockRequestService } from '@/__test__/utils';
import { GithubClient } from './client';

describe('test GithubClient', () => {
  test('test generateNewTokenUrl', () => {
    expect(GithubClient.generateNewTokenUrl).toEqual(
      'https://github.com/settings/tokens/new?scopes=repo&description=Web%20Clipper'
    );
  });

  function getTestFixtures(response?: any) {
    const mockRequestService = new MockRequestService(() => response);
    const githubClient = new GithubClient({
      token: 'DiamondYuan',
      request: mockRequestService,
    });
    return {
      mockRequestService: mockRequestService.mock.request,
      githubClient,
    };
  }

  test('test getUserInfo', async () => {
    const expectResult = { login: 'DiamondYuan' };
    const testFixtures = getTestFixtures(expectResult);
    const result = await testFixtures.githubClient.getUserInfo();
    expect(testFixtures.mockRequestService.mock.calls[0]).toEqual([
      'https://api.github.com/user',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: 'token DiamondYuan',
        },
        method: 'get',
      },
    ]);
    expect(result).toEqual(expectResult);
  });

  test('test createIssue', async () => {
    const expectResult = { html_url: 'html_url', id: 'id' };
    const testFixtures = getTestFixtures(expectResult);
    const result = await testFixtures.githubClient.createIssue({
      title: 'title',
      body: 'body',
      labels: ['label1', 'label2'],
      namespace: 'webclipper/web-clipper',
    });
    expect(testFixtures.mockRequestService.mock.calls[0]).toEqual([
      'https://api.github.com/repos/webclipper/web-clipper/issues',
      {
        data: { title: 'title', body: 'body', labels: ['label1', 'label2'] },
        method: 'post',
        requestType: 'json',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: 'token DiamondYuan',
        },
      },
    ]);
    expect(result).toEqual(expectResult);
  });

  test('test createIssue', async () => {
    const expectResult = { html_url: 'html_url', id: 'id' };
    const testFixtures = getTestFixtures(expectResult);
    const result = await testFixtures.githubClient.uploadFile({
      owner: 'owner',
      repo: 'repo',
      path: 'path',
      message: 'message',
      content: 'content',
      branch: 'branch',
    });
    console.log(testFixtures.mockRequestService.mock.calls[0]);
    expect(testFixtures.mockRequestService.mock.calls[0]).toEqual([
      'https://api.github.com/repos/owner/repo/contents/path',
      {
        data: { message: 'message', content: 'content', branch: 'branch' },
        method: 'put',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: 'token DiamondYuan',
        },
      },
    ]);
    expect(result).toEqual(expectResult);
  });
});
