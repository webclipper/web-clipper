import { generateUuid } from '@web-clipper/shared/lib/uuid';
import { IExtendRequestHelper } from '@/service/common/request';
import { Repository, IJoplinClient, JoplinTag, JoplinCreateDocumentRequest } from './types';

export abstract class AbstractJoplinClient implements IJoplinClient {
  constructor(protected request: IExtendRequestHelper) {}

  public uploadBlob = async (blob: Blob): Promise<string> => {
    let formData = new FormData();
    formData.append('data', blob);
    formData.append(
      'props',
      JSON.stringify({
        title: generateUuid(),
      })
    );
    const result = await this.request.postForm<{ id: string }>(`resources`, {
      data: formData,
    });
    return `:/${result.id}`;
  };

  abstract getTags(filterTags: boolean): Promise<JoplinTag[]>;
  abstract getRepositories(): Promise<Repository[]>;
  abstract createDocument(data: JoplinCreateDocumentRequest): Promise<void>;
}
