import { Test, TestingModule } from '@nestjs/testing';
import { CreateTopicSnapshotUseCase } from '../application/use-cases/create-topic-snapshot.use-case';
import { TopicHistoryService } from '../application/services/topic-history.service';
import { ResourceHistoryService } from '../application/services/resource-history.service';
import { ActivityHistoryService } from '../application/services/activity-history.service';
import { Topic } from '../../courses/domain/entities/topic.entity';
import { Resource } from '../../courses/domain/entities/resource.entity';
import { Activity } from '../../courses/domain/entities/activity.entity';
import { ResourceType } from '../../courses/domain/enums/resource-type.enum';
import { ActivityType } from '../../courses/domain/enums/activity-type.enum';
import { HistoryAction } from '../domain/enums/history-action.enum';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
describe('CreateTopicSnapshotUseCase', () => {
  let useCase: CreateTopicSnapshotUseCase;
  let topicHistoryService: TopicHistoryService;
  let resourceHistoryService: ResourceHistoryService;
  let activityHistoryService: ActivityHistoryService;
  const mockUser: User = {
    id: 'user-1',
    firstName: 'Alex',
    lastName: 'Editor',
    email: 'alex@example.com',
    role: UserRole.TEACHER_EDITOR,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;
  const mockTopic: Topic = {
    id: 'topic-1',
    courseId: 'course-1',
    title: 'Original Topic',
    description: 'Original description',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Topic;
  const mockResource: Resource = {
    id: 'resource-1',
    topicId: 'topic-1',
    title: 'Original resource',
    description: 'Original description',
    type: ResourceType.DOCUMENT,
    url: 'https://example.com/doc',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Resource;
  const mockActivity: Activity = {
    id: 'activity-1',
    topicId: 'topic-1',
    title: 'Original activity',
    description: 'Original activity description',
    type: ActivityType.ASSIGNMENT,
    content: { body: 'Original content' },
    order: 1,
    isRequired: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Activity;
  const mockTopicSnapshot = { id: 'topic-history-1' };
  const mockResourceSnapshot = { id: 'resource-history-1' };
  const mockActivitySnapshot = { id: 'activity-history-1' };
  const mockTopicHistoryService = {
    createSnapshot: jest.fn().mockResolvedValue(mockTopicSnapshot),
  };
  const mockResourceHistoryService = {
    createSnapshot: jest.fn().mockResolvedValue(mockResourceSnapshot),
  };
  const mockActivityHistoryService = {
    createSnapshot: jest.fn().mockResolvedValue(mockActivitySnapshot),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTopicSnapshotUseCase,
        {
          provide: TopicHistoryService,
          useValue: mockTopicHistoryService,
        },
        {
          provide: ResourceHistoryService,
          useValue: mockResourceHistoryService,
        },
        {
          provide: ActivityHistoryService,
          useValue: mockActivityHistoryService,
        },
      ],
    }).compile();
    useCase = module.get<CreateTopicSnapshotUseCase>(
      CreateTopicSnapshotUseCase,
    );
    topicHistoryService = module.get<TopicHistoryService>(TopicHistoryService);
    resourceHistoryService = module.get<ResourceHistoryService>(
      ResourceHistoryService,
    );
    activityHistoryService = module.get<ActivityHistoryService>(
      ActivityHistoryService,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should create snapshots for topic, resources and activities', async () => {
    const command = {
      topic: mockTopic,
      user: mockUser,
      action: HistoryAction.UPDATE,
      topicChanges: { title: 'Updated Topic' },
      previousTopicData: { title: 'Original Topic' },
      resourceChanges: [
        {
          resource: mockResource,
          changes: { title: 'Updated resource' },
          previousData: { title: 'Original resource' },
        },
      ],
      activityChanges: [
        {
          activity: mockActivity,
          changes: { title: 'Updated activity' },
          previousData: { title: 'Original activity' },
        },
      ],
    };
    const result = await useCase.execute(command);
    expect(topicHistoryService.createSnapshot).toHaveBeenCalledWith(
      mockTopic,
      mockUser,
      HistoryAction.UPDATE,
      command.topicChanges,
      command.previousTopicData,
    );
    expect(resourceHistoryService.createSnapshot).toHaveBeenCalledWith(
      mockResource,
      mockUser,
      HistoryAction.UPDATE,
      command.resourceChanges[0].changes,
      command.resourceChanges[0].previousData,
    );
    expect(activityHistoryService.createSnapshot).toHaveBeenCalledWith(
      mockActivity,
      mockUser,
      HistoryAction.UPDATE,
      command.activityChanges[0].changes,
      command.activityChanges[0].previousData,
    );
    expect(result).toEqual({
      topicHistory: mockTopicSnapshot,
      resourceHistories: [mockResourceSnapshot],
      activityHistories: [mockActivitySnapshot],
    });
  });
  it('should skip resource and activity histories when no changes provided', async () => {
    const command = {
      topic: mockTopic,
      user: mockUser,
      action: HistoryAction.UPDATE,
      topicChanges: { title: 'Updated Topic' },
      previousTopicData: { title: 'Original Topic' },
      resourceChanges: [],
      activityChanges: undefined,
    };
    const result = await useCase.execute(command);
    expect(topicHistoryService.createSnapshot).toHaveBeenCalledTimes(1);
    expect(resourceHistoryService.createSnapshot).not.toHaveBeenCalled();
    expect(activityHistoryService.createSnapshot).not.toHaveBeenCalled();
    expect(result).toEqual({
      topicHistory: mockTopicSnapshot,
      resourceHistories: [],
      activityHistories: [],
    });
  });
});