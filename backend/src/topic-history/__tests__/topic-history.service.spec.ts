import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TopicHistoryService } from '../application/services/topic-history.service';
import { TopicHistory } from '../domain/entities/topic-history.entity';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
import { Topic } from '../../courses/domain/entities/topic.entity';
import { HistoryAction } from '../domain/enums/history-action.enum';

type TopicHistoryRepositoryMock = jest.Mocked<
  Pick<Repository<TopicHistory>, 'create' | 'save' | 'find' | 'findOne'>
>;

const createTopicHistoryRepositoryMock = (): TopicHistoryRepositoryMock => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

const buildUser = (): User => {
  const user = new User();
  user.id = 'user-1';
  user.firstName = 'John';
  user.lastName = 'Doe';
  user.email = 'john@example.com';
  user.password = 'hashed';
  user.role = UserRole.TEACHER_EDITOR;
  user.isActive = true;
  user.createdAt = new Date();
  user.updatedAt = new Date();
  return user;
};

const buildTopic = (): Topic => {
  const topic = new Topic();
  topic.id = 'topic-1';
  topic.courseId = 'course-1';
  topic.title = 'Test Topic';
  topic.description = 'Test Description';
  topic.order = 1;
  topic.isActive = true;
  topic.createdAt = new Date();
  topic.updatedAt = new Date();
  return topic;
};

const buildTopicHistory = (overrides?: Partial<TopicHistory>): TopicHistory => {
  const history = new TopicHistory();
  history.id = 'history-1';
  history.topicId = 'topic-1';
  history.version = 1;
  history.action = HistoryAction.UPDATE;
  history.changes = { title: 'Updated Title' };
  history.previousData = { title: 'Old Title' };
  history.currentData = { title: 'Updated Title' };
  history.editedBy = buildUser();
  history.editedById = history.editedBy.id;
  history.editedAt = new Date();
  return Object.assign(history, overrides);
};

describe('TopicHistoryService', () => {
  let service: TopicHistoryService;
  let topicHistoryRepository: TopicHistoryRepositoryMock;

  const mockUser = buildUser();
  const mockTopic = buildTopic();

  beforeEach(async () => {
    topicHistoryRepository = createTopicHistoryRepositoryMock();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TopicHistoryService,
        {
          provide: getRepositoryToken(TopicHistory),
          useValue: topicHistoryRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<TopicHistoryService>(TopicHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSnapshot', () => {
    it('should create a topic snapshot successfully', async () => {
      const historyEntry = buildTopicHistory({ version: 2 });
      topicHistoryRepository.create.mockReturnValue(historyEntry);
      topicHistoryRepository.save.mockResolvedValue(historyEntry);
      topicHistoryRepository.findOne.mockResolvedValueOnce(
        buildTopicHistory({ version: 1 }),
      );

      const result = await service.createSnapshot(
        mockTopic,
        mockUser,
        HistoryAction.UPDATE,
        { title: 'New Title' },
      );

      expect(topicHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          topicId: mockTopic.id,
          action: HistoryAction.UPDATE,
          changes: { title: 'New Title' },
          editedBy: mockUser,
          editedById: mockUser.id,
          version: 2,
        }),
      );
      expect(topicHistoryRepository.save).toHaveBeenCalledWith(historyEntry);
      expect(result).toEqual(historyEntry);
    });

    it('should throw ForbiddenException for non-teacher-editor users', async () => {
      const studentUser = { ...mockUser, role: UserRole.STUDENT };

      await expect(
        service.createSnapshot(
          mockTopic,
          studentUser,
          HistoryAction.UPDATE,
          {},
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getTopicHistory', () => {
    it('should return topic history for valid user', async () => {
      const historyEntry = buildTopicHistory();
      topicHistoryRepository.find.mockResolvedValue([historyEntry]);

      const result = await service.getTopicHistory(mockTopic.id, mockUser);

      expect(topicHistoryRepository.find).toHaveBeenCalledWith({
        where: { topicId: mockTopic.id },
        relations: ['editedBy'],
        order: { version: 'DESC' },
      });
      expect(result).toEqual([historyEntry]);
    });

    it('should throw ForbiddenException for unauthorized users', async () => {
      const studentUser = { ...mockUser, role: UserRole.STUDENT };

      await expect(
        service.getTopicHistory(mockTopic.id, studentUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getVersionById', () => {
    it('should return specific version', async () => {
      const historyEntry = buildTopicHistory();
      topicHistoryRepository.findOne.mockResolvedValue(historyEntry);

      const result = await service.getVersionById('history-1', mockUser);

      expect(topicHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'history-1' },
        relations: ['editedBy'],
      });
      expect(result).toEqual(historyEntry);
    });

    it('should throw NotFoundException for non-existent version', async () => {
      topicHistoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getVersionById('non-existent', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('compareVersions', () => {
    it('should compare two versions successfully', async () => {
      const version1 = buildTopicHistory({ version: 1 });
      const version2 = buildTopicHistory({
        id: 'history-2',
        version: 2,
        currentData: { title: 'Title 2' },
      });

      topicHistoryRepository.findOne
        .mockResolvedValueOnce(version1)
        .mockResolvedValueOnce(version2);

      const result = await service.compareVersions(
        mockTopic.id,
        1,
        2,
        mockUser,
      );

      expect(result).toHaveProperty('differences');
      expect(result).toHaveProperty('version1', version1);
      expect(result).toHaveProperty('version2', version2);
    });
  });

  describe('getNextVersion', () => {
    it('should return correct next version number', async () => {
      topicHistoryRepository.findOne.mockResolvedValue(
        buildTopicHistory({ version: 5 }),
      );

      await expect(service.getNextVersion(mockTopic.id)).resolves.toBe(6);
    });

    it('should return 1 for topics with no history', async () => {
      topicHistoryRepository.findOne.mockResolvedValue(null);

      await expect(service.getNextVersion(mockTopic.id)).resolves.toBe(1);
    });
  });
});
