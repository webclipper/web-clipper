import { MockRequestService } from '@/__test__/utils';
import WallabagClient from './client';
const FormData = require('form-data');

describe('test WallabagClient', () => {
  test('test login', async () => {
    const expectedResponse = {
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
    };
    const mockRequestService = new MockRequestService(() => expectedResponse);
    const inputStub = {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      client_id: 'client_id',
      client_secret: 'client_secret',
      wallabag_host: 'https://wallabag_host',
    };
    const client = new WallabagClient(inputStub, mockRequestService);
    const result = await client.refreshToken();
    const expectUrlGenerated = `${inputStub.wallabag_host}/oauth/v2/token?grant_type=refresh_token&client_id=client_id&client_secret=client_secret&refresh_token=refresh_token`;
    expect(mockRequestService.mock.request.mock.calls[0][0]).toEqual(expectUrlGenerated);
    expect(result).toEqual(expectedResponse.access_token);
  });

  test('test getUserInfo', async () => {
    const notebookListStubResponse = { username: 'user', id: 'id' };
    const inputStub = {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      client_id: 'client_id',
      client_secret: 'client_secret',
      wallabag_host: 'https://wallabag_host',
    };
    const mockRequestService = new MockRequestService(() => notebookListStubResponse);
    const client = new WallabagClient(inputStub, mockRequestService);
    const result = await client.getUserInfo();
    const expectUrlGenerated = `${inputStub.wallabag_host}/api/user.json`;
    expect(mockRequestService.mock.request.mock.calls[0][0]).toEqual(expectUrlGenerated);
    expect(notebookListStubResponse).toEqual(result);
  });

  test('test getUserInfo with exceeded access_token', async () => {
    const notebookListStubResponse = {
      error: 'invalid_grant',
      error_description: 'The access token provided has expired.',
    };
    const refreshTokenStubResponse = {
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
    };

    const inputStub = {
      access_token: 'old_access_token',
      refresh_token: 'refresh_token',
      client_id: 'client_id',
      client_secret: 'client_secret',
      wallabag_host: 'https://wallabag_host',
    };

    let isFirstRequest = true;
    const mockRequestService = new MockRequestService(url => {
      switch (url) {
        case `${inputStub.wallabag_host}/api/user.json`:
          if (isFirstRequest) {
            // the first request fails with status 401
            isFirstRequest = false;
            const err = new Error() as any;
            err.response = { status: 401 };
            throw err;
          }
          return notebookListStubResponse;
        case `${inputStub.wallabag_host}/oauth/v2/token?grant_type=refresh_token&client_id=client_id&client_secret=client_secret&refresh_token=refresh_token`:
          return refreshTokenStubResponse;
        default:
          throw Error(`No value for request to ${url}`);
      }
    });
    const client = new WallabagClient(inputStub, mockRequestService);
    const result = await client.getUserInfo();
    const userInfoUrl = `${inputStub.wallabag_host}/api/user.json`;
    let firstUserInfoRequest = mockRequestService.mock.request.mock.calls[0];
    let secondUserInfoRequest = mockRequestService.mock.request.mock.calls[2];
    expect(firstUserInfoRequest[0]).toEqual(userInfoUrl);
    expect(secondUserInfoRequest[0]).toEqual(userInfoUrl);
    expect(secondUserInfoRequest[1].headers.Authorization).toEqual(
      `Bearer ${refreshTokenStubResponse.access_token}`
    );

    expect(notebookListStubResponse).toEqual(result);
  });

  test('test create document', async () => {
    const createDocumentStubResponse = { username: 'user', id: 'id' };
    const inputStub = {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      client_id: 'client_id',
      client_secret: 'client_secret',
      wallabag_host: 'wallabag_host',
    };
    const mockRequestService = new MockRequestService(() => createDocumentStubResponse);
    const client = new WallabagClient(inputStub, mockRequestService);
    await client.createDocument({
      title: 'some_title',
      content: 'some_content',
      repositoryId: 'some_repo',
    });
    const expectUrlGenerated = `${inputStub.wallabag_host}/api/entries.json`;
    const calledUrl = mockRequestService.mock.request.mock.calls[0][0];
    const callRequest = mockRequestService.mock.request.mock.calls[0][1];
    expect(calledUrl).toEqual(expectUrlGenerated);
    expect(Object.keys(callRequest.data).length).toBeGreaterThan(0);
    expect(callRequest.data.constructor).toEqual(FormData);
    expect(callRequest.requestType).toEqual('form');
    expect(callRequest.method).toEqual('post');
  });
});
