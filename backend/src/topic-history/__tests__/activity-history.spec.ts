import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityHistoryService } from '../application/services/activity-history.service';
import { ActivityHistory } from '../domain/entities/activity-history.entity';
import { Activity } from '../../courses/domain/entities/activity.entity';
import { ActivityType } from '../../courses/domain/enums/activity-type.enum';
import { HistoryAction } from '../domain/enums/history-action.enum';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
import { TopicHistory } from '../domain/entities/topic-history.entity';

type ActivityHistoryRepositoryMock = jest.Mocked<
  Pick<Repository<ActivityHistory>, 'create' | 'save' | 'find' | 'findOne'>
>;

const createActivityHistoryRepositoryMock =
  (): ActivityHistoryRepositoryMock => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  });

const buildUser = (): User => {
  const user = new User();
  user.id = 'user-1';
  user.firstName = 'Alice';
  user.lastName = 'Doe';
  user.email = 'alice@example.com';
  user.password = 'hashed';
  user.role = UserRole.TEACHER_EDITOR;
  user.isActive = true;
  user.createdAt = new Date();
  user.updatedAt = new Date();
  return user;
};

const buildActivity = (): Activity => {
  const activity = new Activity();
  activity.id = 'activity-1';
  activity.topicId = 'topic-1';
  activity.title = 'Initial title';
  activity.description = 'Initial description';
  activity.type = ActivityType.ASSIGNMENT;
  activity.content = { body: 'Initial content' };
  activity.order = 1;
  activity.isRequired = true;
  activity.isActive = true;
  activity.createdAt = new Date();
  activity.updatedAt = new Date();
  return activity;
};

const buildTopicHistoryRecord = (user: User, topicId: string): TopicHistory => {
  const topicHistory = new TopicHistory();
  topicHistory.id = 'topic-history-1';
  topicHistory.topicId = topicId;
  topicHistory.version = 1;
  topicHistory.action = HistoryAction.UPDATE;
  topicHistory.previousData = {};
  topicHistory.currentData = {};
  topicHistory.changes = {};
  topicHistory.editedBy = user;
  topicHistory.editedById = user.id;
  topicHistory.editedAt = new Date();
  return topicHistory;
};

const buildActivityHistory = (
  activity: Activity,
  user: User,
  overrides?: Partial<ActivityHistory>,
): ActivityHistory => {
  const history = new ActivityHistory();
  history.id = 'activity-history-1';
  history.activityId = activity.id;
  history.topicId = activity.topicId;
  history.version = 1;
  history.action = HistoryAction.UPDATE;
  history.changes = { title: 'Updated title' };
  history.previousData = { title: 'Initial title' };
  history.currentData = { title: 'Updated title' };
  history.editedBy = user;
  history.editedById = user.id;
  history.editedAt = new Date();
  const topicHistory = buildTopicHistoryRecord(user, activity.topicId);
  history.topicHistoryId = topicHistory.id;
  history.topicHistory = topicHistory;
  return Object.assign(history, overrides);
};

describe('ActivityHistoryService', () => {
  let service: ActivityHistoryService;
  let activityHistoryRepository: ActivityHistoryRepositoryMock;

  const mockUser = buildUser();
  const mockActivity = buildActivity();

  beforeEach(async () => {
    activityHistoryRepository = createActivityHistoryRepositoryMock();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityHistoryService,
        {
          provide: getRepositoryToken(ActivityHistory),
          useValue: activityHistoryRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<ActivityHistoryService>(ActivityHistoryService);
  });

  describe('createSnapshot', () => {
    it('should create a snapshot when user has permissions', async () => {
      const historyEntry = buildActivityHistory(mockActivity, mockUser, {
        version: 2,
      });
      activityHistoryRepository.create.mockReturnValue(historyEntry);
      activityHistoryRepository.save.mockResolvedValue(historyEntry);
      activityHistoryRepository.findOne.mockResolvedValueOnce(
        buildActivityHistory(mockActivity, mockUser, { version: 1 }),
      );

      const result = await service.createSnapshot(
        mockActivity,
        mockUser,
        HistoryAction.UPDATE,
        { title: 'Updated title' },
        { title: 'Initial title' },
      );

      expect(activityHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          activityId: mockActivity.id,
          topicId: mockActivity.topicId,
          action: HistoryAction.UPDATE,
          changes: { title: 'Updated title' },
          previousData: { title: 'Initial title' },
          currentData: { title: 'Updated title' },
          editedBy: mockUser,
          editedById: mockUser.id,
          version: 2,
        }),
      );
      expect(activityHistoryRepository.save).toHaveBeenCalledWith(historyEntry);
      expect(result).toEqual(historyEntry);
    });

    it('should throw ForbiddenException for non editor users', async () => {
      const studentUser = { ...mockUser, role: UserRole.STUDENT };

      await expect(
        service.createSnapshot(
          mockActivity,
          studentUser,
          HistoryAction.UPDATE,
          {},
          {},
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getActivityHistory', () => {
    it('should return activity history ordered by latest version', async () => {
      const historyEntry = buildActivityHistory(mockActivity, mockUser);
      activityHistoryRepository.find.mockResolvedValue([historyEntry]);

      const result = await service.getActivityHistory(
        mockActivity.id,
        mockUser,
      );

      expect(activityHistoryRepository.find).toHaveBeenCalledWith({
        where: { activityId: mockActivity.id },
        relations: ['editedBy'],
        order: { version: 'DESC' },
      });
      expect(result).toEqual([historyEntry]);
    });

    it('should throw ForbiddenException for unauthorized users', async () => {
      const studentUser = { ...mockUser, role: UserRole.STUDENT };

      await expect(
        service.getActivityHistory(mockActivity.id, studentUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getVersionById', () => {
    it('should return the requested activity version', async () => {
      const historyEntry = buildActivityHistory(mockActivity, mockUser);
      activityHistoryRepository.findOne.mockResolvedValue(historyEntry);

      const result = await service.getVersionById(
        'activity-history-1',
        mockUser,
      );

      expect(activityHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'activity-history-1' },
        relations: ['editedBy'],
      });
      expect(result).toEqual(historyEntry);
    });

    it('should throw NotFoundException when version does not exist', async () => {
      activityHistoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getVersionById('missing-id', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('compareVersions', () => {
    it('should return the diff between two versions', async () => {
      const version1 = buildActivityHistory(mockActivity, mockUser, {
        version: 1,
      });
      const version2 = buildActivityHistory(mockActivity, mockUser, {
        id: 'activity-history-2',
        version: 2,
        currentData: { title: 'Title 2' },
      });

      activityHistoryRepository.findOne
        .mockResolvedValueOnce(version1)
        .mockResolvedValueOnce(version2);

      const result = await service.compareVersions(
        mockActivity.id,
        1,
        2,
        mockUser,
      );

      expect(result.activityId).toBe(mockActivity.id);
      expect(result.version1).toEqual(version1);
      expect(result.version2).toEqual(version2);
      expect(result.differences).toBeDefined();
    });

    it('should throw NotFoundException if any version is missing', async () => {
      activityHistoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.compareVersions(mockActivity.id, 1, 2, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getNextVersion', () => {
    it('should return next incremental version', async () => {
      activityHistoryRepository.findOne.mockResolvedValue(
        buildActivityHistory(mockActivity, mockUser, { version: 4 }),
      );

      await expect(service.getNextVersion(mockActivity.id)).resolves.toBe(5);
    });

    it('should start at version 1 when there is no history', async () => {
      activityHistoryRepository.findOne.mockResolvedValue(null);

      await expect(service.getNextVersion(mockActivity.id)).resolves.toBe(1);
    });
  });
});
