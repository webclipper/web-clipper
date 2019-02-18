import GithubDocumentService from './github';
import YuqueDocumentService from './yuque';

interface DocumentServiceOption {
  type: string;
  accessToken: string;
  baseURL: string;
}

export class BackendContext {
  private documentService: DocumentService;

  setDocumentService(documentService: DocumentService) {
    this.documentService = documentService;
  }

  getDocumentService() {
    return this.documentService;
  }
}

export function documentServiceFactory(
  option: DocumentServiceOption
): DocumentService {
  const { type, baseURL, accessToken } = option;
  if (type === 'yuque') {
    return new YuqueDocumentService({
      baseURL,
      accessToken
    });
  }
  if (type === 'github') {
    return new GithubDocumentService({
      baseURL,
      accessToken
    });
  }
  throw new Error('unSupport type');
}

export default new BackendContext();
