import { MockRequestService } from '@/__test__/utils';
import LeanoteClient from './client';
const FormData = require('form-data');

describe('test LeanoteClient', () => {
  test('test login', async () => {
    const expectedResponseToken = { Token: 'SomeToken' };
    const mockRequestService = new MockRequestService(() => expectedResponseToken);
    const inputStub = {
      leanote_host: 'leanote_host',
      email: 'email',
      pwd: 'pwd',
      token_cached: 'OldToken',
    };
    const client = new LeanoteClient(inputStub, mockRequestService);
    const result = await client.login();
    const expectUrlGenerated = `${inputStub.leanote_host}/api/auth/login?email=${inputStub.email}&pwd=${inputStub.pwd}`;
    expect(mockRequestService.mock.request.mock.calls[0][0]).toEqual(expectUrlGenerated);
    expect(result).toEqual(expectedResponseToken.Token);
  });

  test('test repository', async () => {
    const notebookListStubResponse = [{ NotebookId: 1, Title: 'some_notebook_title' }];
    const inputStub = {
      leanote_host: 'leanote_host',
      email: '',
      pwd: '',
      token_cached: 'some_token_when_already_logged',
    };
    const mockRequestService = new MockRequestService(() => notebookListStubResponse);
    const client = new LeanoteClient(inputStub, mockRequestService);
    const result = await client.getSyncNotebooks();
    const expectUrlGenerated = `${inputStub.leanote_host}/api/notebook/getSyncNotebooks?token=${inputStub.token_cached}`;
    expect(mockRequestService.mock.request.mock.calls[0][0]).toEqual(expectUrlGenerated);
    expect(notebookListStubResponse[0].Title).toEqual(result[0].Title);
  });

  test('test create document', async () => {
    const inputStub = {
      leanote_host: 'leanote_host',
      email: '',
      pwd: '',
      token_cached: 'some_token_when_already_logged',
    };
    const mockRequestService = new MockRequestService(function() {
      // No return expected
    });
    const client = new LeanoteClient(inputStub, mockRequestService);
    await client.createDocument({
      title: 'some_title',
      content: 'some_content',
      repositoryId: 'some_repo',
    });
    const expectUrlGenerated = `${inputStub.leanote_host}/api/note/addNote?token=${inputStub.token_cached}`;
    const calledUrl = mockRequestService.mock.request.mock.calls[0][0];
    const callRequest = mockRequestService.mock.request.mock.calls[0][1];
    expect(calledUrl).toEqual(expectUrlGenerated);
    expect(Object.keys(callRequest.data).length).toBeGreaterThan(0);
    expect(callRequest.data.constructor).toEqual(FormData);
    expect(callRequest.requestType).toEqual('form');
    expect(callRequest.method).toEqual('post');
  });
});
