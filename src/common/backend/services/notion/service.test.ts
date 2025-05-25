import NotionDocumentService from './service';
import { IWebRequestService } from '@/service/common/webRequest';
import { ICookieService } from '@/service/common/cookie';
import { NotionUserContent } from './types';
import Container from 'typedi';

// Mock services
jest.mock('@/service/common/webRequest');
jest.mock('@/service/common/cookie');

describe('NotionDocumentService', () => {
  let notionService: NotionDocumentService;
  let mockWebRequestService: jest.Mocked<IWebRequestService>;
  let mockCookieService: jest.Mocked<ICookieService>;

  beforeEach(() => {
    // Create new instances of mock services for each test
    mockWebRequestService = {
      startChangeHeader: jest.fn(),
      end: jest.fn(),
      changeUrl: jest.fn(url => Promise.resolve(url)), // Ensure changeUrl returns a Promise<string>
    } as any; // Using 'as any' to simplify mock structure for this example
    mockCookieService = {
      getAll: jest.fn().mockResolvedValue([]), // Mock getAll to return empty array or relevant cookie structure
      set: jest.fn(),
      remove: jest.fn(),
      get: jest.fn(),
    } as any; // Using 'as any' to simplify mock structure

    // Mock Container.get for each service
    Container.get = jest.fn().mockImplementation((token: any) => {
      if (token === IWebRequestService) {
        return mockWebRequestService;
      }
      if (token === ICookieService) {
        return mockCookieService;
      }
      throw new Error(`Unknown token: ${String(token)}`);
    }) as any;

    notionService = new NotionDocumentService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRepositories', () => {
    it('should return an empty array when recordMap.space is undefined', async () => {
      // Mock getUserContent to return a userContent object where recordMap.space is undefined
      const mockUserContent: Partial<NotionUserContent> = {
        recordMap: {
          // space is intentionally undefined
          block: {},
          notion_user: {},
          collection: {},
          collection_view: {},
          comment: {},
          discussion: {},
          follow: {},
          space_view: {},
          user_root: {},
          user_settings: {},
          team: {},
          team_role: {},
          collection_block_column_order: {},
          collection_block_column_format: {},
        } as any, // Using 'as any' to bypass strict type checks for partial mock
      };

      jest.spyOn(notionService as any, 'getUserContent').mockResolvedValue(mockUserContent as NotionUserContent);

      const repositories = await notionService.getRepositories();

      expect(repositories).toEqual([]);
      expect((notionService as any).getUserContent).toHaveBeenCalledTimes(1);
    });

    // Add other test cases for getRepositories if needed
  });

  // Add tests for other methods of NotionDocumentService
});
