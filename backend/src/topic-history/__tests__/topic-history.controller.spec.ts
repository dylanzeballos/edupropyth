import { Test, TestingModule } from '@nestjs/testing';
import { TopicHistoryController } from '../presentation/controllers/topic-history.controller';
import { TopicHistoryService } from '../application/services/topic-history.service';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
import { TopicHistory } from '../domain/entities/topic-history.entity';
import { HistoryAction } from '../domain/enums/history-action.enum';
describe('TopicHistoryController', () => {
  let controller: TopicHistoryController;
  let service: TopicHistoryService;
  const mockTopicHistoryEntry: TopicHistory = {
    id: 'history-1',
    topicId: 'topic-1',
    version: 1,
    action: HistoryAction.UPDATE,
    changes: { title: 'Updated Title' },
    previousData: { title: 'Original Title' },
    currentData: { title: 'Updated Title' },
    editedAt: new Date('2024-01-01T12:00:00Z'),
    editedBy: {
      id: 'user-1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      role: UserRole.TEACHER_EDITOR,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User,
  } as TopicHistory;
  const mockComparison = {
    version1: mockTopicHistoryEntry,
    version2: { ...mockTopicHistoryEntry, id: 'history-2', version: 2 },
    differences: { title: { from: 'Original Title', to: 'Updated Title' } },
  };
  const mockUser: User = {
    id: 'user-1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    role: UserRole.TEACHER_EDITOR,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;
  const mockTopicHistoryService = {
    getTopicHistory: jest.fn(),
    getVersionById: jest.fn(),
    compareVersions: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicHistoryController],
      providers: [
        {
          provide: TopicHistoryService,
          useValue: mockTopicHistoryService,
        },
      ],
    }).compile();
    controller = module.get<TopicHistoryController>(TopicHistoryController);
    service = module.get<TopicHistoryService>(TopicHistoryService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getTopicHistory', () => {
    it('should return the topic history list', async () => {
      mockTopicHistoryService.getTopicHistory.mockResolvedValue([
        mockTopicHistoryEntry,
      ]);
      const result = await controller.getTopicHistory('topic-1', mockUser);
      expect(service.getTopicHistory).toHaveBeenCalledWith(
        'topic-1',
        mockUser,
      );
      expect(result).toEqual([mockTopicHistoryEntry]);
    });
    it('should propagate errors from the service layer', async () => {
      const error = new Error('Service failure');
      mockTopicHistoryService.getTopicHistory.mockRejectedValue(error);
      await expect(
        controller.getTopicHistory('topic-1', mockUser),
      ).rejects.toThrow(error);
    });
  });
  describe('getVersionById', () => {
    it('should return a specific history version', async () => {
      mockTopicHistoryService.getVersionById.mockResolvedValue(
        mockTopicHistoryEntry,
      );
      const result = await controller.getVersionById('history-1', mockUser);
      expect(service.getVersionById).toHaveBeenCalledWith(
        'history-1',
        mockUser,
      );
      expect(result).toEqual(mockTopicHistoryEntry);
    });
  });
  describe('compareVersions', () => {
    it('should delegate comparison to the service', async () => {
      mockTopicHistoryService.compareVersions.mockResolvedValue(
        mockComparison,
      );
      const result = await controller.compareVersions(
        'topic-1',
        1,
        2,
        mockUser,
      );
      expect(service.compareVersions).toHaveBeenCalledWith(
        'topic-1',
        1,
        2,
        mockUser,
      );
      expect(result).toEqual(mockComparison);
    });
    it('should propagate errors thrown by the service', async () => {
      const error = new Error('Unable to compare versions');
      mockTopicHistoryService.compareVersions.mockRejectedValue(error);
      await expect(
        controller.compareVersions('topic-1', 1, 2, mockUser),
      ).rejects.toThrow(error);
    });
  });
});