import { ClipperDataType } from '@/common/modelTypes/userPreference';
import {
  Repository,
  CompleteStatus,
  CreateDocumentRequest,
} from '@/common/backend/services/interface';

export interface ClipperHeaderForm {
  title: string;
  [key: string]: string | number;
}

export interface ClipperStore {
  clipperHeaderForm: ClipperHeaderForm;
  url?: string;
  currentAccountId: string;
  repositories: Repository[];
  currentImageHostingService?: { type: string };
  currentRepository?: Repository;
  clipperData: {
    [key: string]: ClipperDataType;
  };
  completeStatus?: CompleteStatus;
  createDocumentRequest?: CreateDocumentRequest;
}
