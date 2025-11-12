import { Test, TestingModule } from '@nestjs/testing';
import { TopicHistoryController } from '../presentation/controllers/topic-history.controller';
import { TopicHistoryService } from '../application/services/topic-history.service';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
import { TopicHistory } from '../domain/entities/topic-history.entity';
import { HistoryAction } from '../domain/enums/history-action.enum';

const buildUser = (): User => {
  const user = new User();
  user.id = 'user-1';
  user.firstName = 'Jane';
  user.lastName = 'Doe';
  user.email = 'jane@example.com';
  user.password = 'hashed';
  user.role = UserRole.TEACHER_EDITOR;
  user.isActive = true;
  user.createdAt = new Date();
  user.updatedAt = new Date();
  return user;
};

const buildTopicHistory = (): TopicHistory => {
  const history = new TopicHistory();
  history.id = 'history-1';
  history.topicId = 'topic-1';
  history.version = 1;
  history.action = HistoryAction.UPDATE;
  history.changes = { title: 'Updated Title' };
  history.previousData = { title: 'Original Title' };
  history.currentData = { title: 'Updated Title' };
  history.editedBy = buildUser();
  history.editedById = history.editedBy.id;
  history.editedAt = new Date('2024-01-01T12:00:00Z');
  return history;
};

describe('TopicHistoryController', () => {
  let controller: TopicHistoryController;
  let topicHistoryServiceMock: jest.Mocked<
    Pick<
      TopicHistoryService,
      'getTopicHistory' | 'getVersionById' | 'compareVersions'
    >
  >;

  const mockUser = buildUser();
  let mockTopicHistoryEntry: TopicHistory;

  beforeEach(async () => {
    mockTopicHistoryEntry = buildTopicHistory();
    topicHistoryServiceMock = {
      getTopicHistory: jest.fn(),
      getVersionById: jest.fn(),
      compareVersions: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TopicHistoryController],
      providers: [
        {
          provide: TopicHistoryService,
          useValue: topicHistoryServiceMock,
        },
      ],
    }).compile();

    controller = moduleRef.get<TopicHistoryController>(TopicHistoryController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTopicHistory', () => {
    it('should return the topic history list', async () => {
      topicHistoryServiceMock.getTopicHistory.mockResolvedValue([
        mockTopicHistoryEntry,
      ]);

      const result = await controller.getTopicHistory('topic-1', mockUser);

      expect(topicHistoryServiceMock.getTopicHistory).toHaveBeenCalledWith(
        'topic-1',
        mockUser,
      );
      expect(result).toEqual([mockTopicHistoryEntry]);
    });

    it('should propagate errors from the service layer', async () => {
      const error = new Error('Service failure');
      topicHistoryServiceMock.getTopicHistory.mockRejectedValue(error);

      await expect(
        controller.getTopicHistory('topic-1', mockUser),
      ).rejects.toThrow(error);
    });
  });

  describe('getVersionById', () => {
    it('should return a specific history version', async () => {
      topicHistoryServiceMock.getVersionById.mockResolvedValue(
        mockTopicHistoryEntry,
      );

      const result = await controller.getVersionById('history-1', mockUser);

      expect(topicHistoryServiceMock.getVersionById).toHaveBeenCalledWith(
        'history-1',
        mockUser,
      );
      expect(result).toEqual(mockTopicHistoryEntry);
    });
  });

  describe('compareVersions', () => {
    it('should delegate comparison to the service', async () => {
      const comparison = {
        version1: mockTopicHistoryEntry,
        version2: { ...mockTopicHistoryEntry, id: 'history-2', version: 2 },
        differences: { title: { from: 'Original Title', to: 'Updated Title' } },
      };
      topicHistoryServiceMock.compareVersions.mockResolvedValue(comparison);

      const result = await controller.compareVersions(
        'topic-1',
        1,
        2,
        mockUser,
      );

      expect(topicHistoryServiceMock.compareVersions).toHaveBeenCalledWith(
        'topic-1',
        1,
        2,
        mockUser,
      );
      expect(result).toEqual(comparison);
    });

    it('should propagate errors thrown by the service', async () => {
      const error = new Error('Unable to compare versions');
      topicHistoryServiceMock.compareVersions.mockRejectedValue(error);

      await expect(
        controller.compareVersions('topic-1', 1, 2, mockUser),
      ).rejects.toThrow(error);
    });
  });
});
