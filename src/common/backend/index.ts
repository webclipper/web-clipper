export interface ImageHostingService {
  uploadImage(request: UploadImageRequest): Promise<string>;

  uploadImageUrl(url: string): Promise<string>;
}

export interface DocumentService {
  getRepositories(): Promise<Repository[]>;

  createDocument(
    request: CreateDocumentRequest
  ): Promise<CreateDocumentResponse>;

  getUserInfo(): Promise<UserInfo>;
}
