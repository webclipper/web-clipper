import { MockRequestService } from '@/__test__/utils';
import { SiYuanClient } from './client';

describe('test SiYuanClient', () => {
  test('use local kernel address by default', async () => {
    const mockRequestService = new MockRequestService(() => ({ data: { notebooks: [] } }));
    const client = new SiYuanClient({ request: mockRequestService });
    await client.listNotebooks();
    expect(mockRequestService.mock.request.mock.calls[0][0]).toEqual(
      'http://127.0.0.1:6806/api/notebook/lsNotebooks'
    );
  });

  test('use custom remote address', async () => {
    const mockRequestService = new MockRequestService(() => ({ data: { notebooks: [] } }));
    const client = new SiYuanClient({
      request: mockRequestService,
      origin: 'http://192.168.1.10:6806',
    });
    await client.listNotebooks();
    expect(mockRequestService.mock.request.mock.calls[0][0]).toEqual(
      'http://192.168.1.10:6806/api/notebook/lsNotebooks'
    );
  });

  test('access token is sent by authorization header', async () => {
    const mockRequestService = new MockRequestService(() => ({ data: { notebooks: [] } }));
    const client = new SiYuanClient({ request: mockRequestService, accessToken: 'some_token' });
    await client.listNotebooks();
    const requestOptions = mockRequestService.mock.request.mock.calls[0][1] as any;
    expect(requestOptions.headers.Authorization).toEqual('Token some_token');
  });

  test('create note strips the custom base url in markdown', async () => {
    const mockRequestService = new MockRequestService(() => ({
      code: 0,
      msg: '',
      data: 'some_doc_id',
    }));
    const client = new SiYuanClient({
      request: mockRequestService,
      origin: 'http://192.168.1.10:6806',
    });
    const docId = await client.createNote({
      title: 'some_title',
      content: '![](http://192.168.1.10:6806/assets/some_image.png)',
      repositoryId: 'some_notebook_id',
    });
    const requestOptions = mockRequestService.mock.request.mock.calls[0][1] as any;
    expect(requestOptions.data.notebook).toEqual('some_notebook_id');
    expect(requestOptions.data.markdown).toEqual('![](assets/some_image.png)');
    expect(docId).toEqual('some_doc_id');
  });
});
