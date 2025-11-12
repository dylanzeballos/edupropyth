import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicHistoryService } from '../application/services/topic-history.service';
import { TopicHistory } from '../domain/entities/topic-history.entity';
import { ResourceHistory } from '../domain/entities/resource-history.entity';
import { ActivityHistory } from '../domain/entities/activity-history.entity';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
import { Topic } from '../../courses/domain/entities/topic.entity';
import { HistoryAction } from '../domain/enums/history-action.enum';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('TopicHistoryService', () => {
  let service: TopicHistoryService;
  let topicHistoryRepository: Repository<TopicHistory>;
  let resourceHistoryRepository: Repository<ResourceHistory>;
  let activityHistoryRepository: Repository<ActivityHistory>;

  const mockUser: User = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: UserRole.TEACHER_EDITOR,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockTopic: Topic = {
    id: 'topic-1',
    title: 'Test Topic',
    description: 'Test Description',
    order: 1,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Topic;

  const mockTopicHistory: TopicHistory = {
    id: 'history-1',
    topicId: 'topic-1',
    version: 1,
    action: HistoryAction.UPDATE,
    changes: { title: 'Updated Title' },
    previousData: { title: 'Old Title' },
    currentData: { title: 'Updated Title' },
    editedBy: mockUser,
    editedAt: new Date(),
  } as TopicHistory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicHistoryService,
        {
          provide: getRepositoryToken(TopicHistory),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ResourceHistory),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ActivityHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TopicHistoryService>(TopicHistoryService);
    topicHistoryRepository = module.get<Repository<TopicHistory>>(
      getRepositoryToken(TopicHistory),
    );
    resourceHistoryRepository = module.get<Repository<ResourceHistory>>(
      getRepositoryToken(ResourceHistory),
    );
    activityHistoryRepository = module.get<Repository<ActivityHistory>>(
      getRepositoryToken(ActivityHistory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSnapshot', () => {
    it('should create a topic snapshot successfully', async () => {
      jest
        .spyOn(topicHistoryRepository, 'create')
        .mockReturnValue(mockTopicHistory);
      jest
        .spyOn(topicHistoryRepository, 'save')
        .mockResolvedValue(mockTopicHistory);
      jest.spyOn(service, 'getNextVersion').mockResolvedValue(2);

      const result = await service.createSnapshot(
        mockTopic,
        mockUser,
        HistoryAction.UPDATE,
        { title: 'New Title' },
      );

      expect(topicHistoryRepository.create).toHaveBeenCalled();
      expect(topicHistoryRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTopicHistory);
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
      jest
        .spyOn(topicHistoryRepository, 'find')
        .mockResolvedValue([mockTopicHistory]);

      const result = await service.getTopicHistory('topic-1', mockUser);

      expect(topicHistoryRepository.find).toHaveBeenCalledWith({
        where: { topicId: 'topic-1' },
        relations: ['editedBy'],
        order: { version: 'DESC' },
      });
      expect(result).toEqual([mockTopicHistory]);
    });

    it('should throw ForbiddenException for unauthorized users', async () => {
      const studentUser = { ...mockUser, role: UserRole.STUDENT };

      await expect(
        service.getTopicHistory('topic-1', studentUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getVersionById', () => {
    it('should return specific version', async () => {
      jest
        .spyOn(topicHistoryRepository, 'findOne')
        .mockResolvedValue(mockTopicHistory);

      const result = await service.getVersionById('history-1', mockUser);

      expect(topicHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'history-1' },
        relations: ['editedBy'],
      });
      expect(result).toEqual(mockTopicHistory);
    });

    it('should throw NotFoundException for non-existent version', async () => {
      jest.spyOn(topicHistoryRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.getVersionById('non-existent', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('compareVersions', () => {
    it('should compare two versions successfully', async () => {
      const version1 = {
        ...mockTopicHistory,
        version: 1,
        currentData: { title: 'Title 1' },
      };
      const version2 = {
        ...mockTopicHistory,
        version: 2,
        currentData: { title: 'Title 2' },
      };

      jest
        .spyOn(topicHistoryRepository, 'findOne')
        .mockResolvedValueOnce(version1)
        .mockResolvedValueOnce(version2);

      const result = await service.compareVersions('topic-1', 1, 2, mockUser);

      expect(result).toHaveProperty('differences');
      expect(result).toHaveProperty('version1');
      expect(result).toHaveProperty('version2');
    });
  });

  describe('getNextVersion', () => {
    it('should return correct next version number', async () => {
      jest.spyOn(topicHistoryRepository, 'findOne').mockResolvedValue({
        version: 5,
      } as TopicHistory);

      const result = await service.getNextVersion('topic-1');

      expect(result).toBe(6);
    });

    it('should return 1 for topics with no history', async () => {
      jest.spyOn(topicHistoryRepository, 'findOne').mockResolvedValue(null);

      const result = await service.getNextVersion('topic-1');

      expect(result).toBe(1);
    });
  });
});
