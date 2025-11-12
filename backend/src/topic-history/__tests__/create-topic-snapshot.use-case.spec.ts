import { Test, TestingModule } from '@nestjs/testing';
import { CreateTopicSnapshotUseCase } from '../application/use-cases/create-topic-snapshot.use-case';
import { TopicHistoryService } from '../application/services/topic-history.service';
import { ResourceHistoryService } from '../application/services/resource-history.service';
import { ActivityHistoryService } from '../application/services/activity-history.service';
import { HistoryAction } from '../domain/enums/history-action.enum';
import { Topic } from '../../courses/domain/entities/topic.entity';
import { Resource } from '../../courses/domain/entities/resource.entity';
import { Activity } from '../../courses/domain/entities/activity.entity';
import { ResourceType } from '../../courses/domain/enums/resource-type.enum';
import { ActivityType } from '../../courses/domain/enums/activity-type.enum';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
import { TopicHistory } from '../domain/entities/topic-history.entity';
import { ResourceHistory } from '../domain/entities/resource-history.entity';
import { ActivityHistory } from '../domain/entities/activity-history.entity';

type SnapshotCommand = Parameters<CreateTopicSnapshotUseCase['execute']>[0];

const buildUser = (): User => {
  const user = new User();
  user.id = 'user-1';
  user.firstName = 'Alex';
  user.lastName = 'Editor';
  user.email = 'alex@example.com';
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
  topic.title = 'Original Topic';
  topic.description = 'Original description';
  topic.order = 1;
  topic.isActive = true;
  topic.createdAt = new Date();
  topic.updatedAt = new Date();
  return topic;
};

const buildResource = (): Resource => {
  const resource = new Resource();
  resource.id = 'resource-1';
  resource.topicId = 'topic-1';
  resource.title = 'Original resource';
  resource.description = 'Original description';
  resource.type = ResourceType.DOCUMENT;
  resource.url = 'https://example.com/doc';
  resource.order = 1;
  resource.isActive = true;
  resource.createdAt = new Date();
  resource.updatedAt = new Date();
  return resource;
};

const buildActivity = (): Activity => {
  const activity = new Activity();
  activity.id = 'activity-1';
  activity.topicId = 'topic-1';
  activity.title = 'Original activity';
  activity.description = 'Original activity description';
  activity.type = ActivityType.ASSIGNMENT;
  activity.content = { body: 'Original content' };
  activity.order = 1;
  activity.isRequired = false;
  activity.isActive = true;
  activity.createdAt = new Date();
  activity.updatedAt = new Date();
  return activity;
};

const buildTopicHistory = (): TopicHistory => {
  const history = new TopicHistory();
  history.id = 'topic-history-1';
  history.topicId = 'topic-1';
  history.version = 1;
  history.action = HistoryAction.UPDATE;
  history.changes = { title: 'Updated Topic' };
  history.previousData = { title: 'Original Topic' };
  history.currentData = { title: 'Updated Topic' };
  history.editedById = 'user-1';
  history.editedAt = new Date();
  return history;
};

const buildResourceHistory = (): ResourceHistory => {
  const history = new ResourceHistory();
  history.id = 'resource-history-1';
  history.resourceId = 'resource-1';
  history.topicId = 'topic-1';
  history.version = 1;
  history.action = HistoryAction.UPDATE;
  history.changes = { title: 'Updated Resource' };
  history.previousData = { title: 'Original resource' };
  history.currentData = { title: 'Updated Resource' };
  history.editedById = 'user-1';
  history.editedAt = new Date();
  return history;
};

const buildActivityHistory = (): ActivityHistory => {
  const history = new ActivityHistory();
  history.id = 'activity-history-1';
  history.activityId = 'activity-1';
  history.topicId = 'topic-1';
  history.version = 1;
  history.action = HistoryAction.UPDATE;
  history.changes = { title: 'Updated Activity' };
  history.previousData = { title: 'Original activity' };
  history.currentData = { title: 'Updated Activity' };
  history.editedById = 'user-1';
  history.editedAt = new Date();
  return history;
};

describe('CreateTopicSnapshotUseCase', () => {
  let useCase: CreateTopicSnapshotUseCase;
  let topicHistoryServiceMock: jest.Mocked<
    Pick<TopicHistoryService, 'createSnapshot'>
  >;
  let resourceHistoryServiceMock: jest.Mocked<
    Pick<ResourceHistoryService, 'createSnapshot'>
  >;
  let activityHistoryServiceMock: jest.Mocked<
    Pick<ActivityHistoryService, 'createSnapshot'>
  >;

  const mockUser = buildUser();
  const mockTopic = buildTopic();
  const mockResource = buildResource();
  const mockActivity = buildActivity();

  let mockTopicSnapshot: TopicHistory;
  let mockResourceSnapshot: ResourceHistory;
  let mockActivitySnapshot: ActivityHistory;

  beforeEach(async () => {
    mockTopicSnapshot = buildTopicHistory();
    mockResourceSnapshot = buildResourceHistory();
    mockActivitySnapshot = buildActivityHistory();

    topicHistoryServiceMock = {
      createSnapshot: jest.fn().mockResolvedValue(mockTopicSnapshot),
    };
    resourceHistoryServiceMock = {
      createSnapshot: jest.fn().mockResolvedValue(mockResourceSnapshot),
    };
    activityHistoryServiceMock = {
      createSnapshot: jest.fn().mockResolvedValue(mockActivitySnapshot),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTopicSnapshotUseCase,
        {
          provide: TopicHistoryService,
          useValue: topicHistoryServiceMock,
        },
        {
          provide: ResourceHistoryService,
          useValue: resourceHistoryServiceMock,
        },
        {
          provide: ActivityHistoryService,
          useValue: activityHistoryServiceMock,
        },
      ],
    }).compile();

    useCase = module.get(CreateTopicSnapshotUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create snapshots for topic, resources and activities', async () => {
    const command: SnapshotCommand = {
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

    expect(topicHistoryServiceMock.createSnapshot).toHaveBeenCalledWith(
      mockTopic,
      mockUser,
      HistoryAction.UPDATE,
      command.topicChanges,
      command.previousTopicData,
    );
    expect(resourceHistoryServiceMock.createSnapshot).toHaveBeenCalledWith(
      mockResource,
      mockUser,
      HistoryAction.UPDATE,
      command.resourceChanges[0].changes,
      command.resourceChanges[0].previousData,
    );
    expect(activityHistoryServiceMock.createSnapshot).toHaveBeenCalledWith(
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
    const command: SnapshotCommand = {
      topic: mockTopic,
      user: mockUser,
      action: HistoryAction.UPDATE,
      topicChanges: { title: 'Updated Topic' },
      previousTopicData: { title: 'Original Topic' },
      resourceChanges: [],
      activityChanges: undefined,
    };

    const result = await useCase.execute(command);

    expect(topicHistoryServiceMock.createSnapshot).toHaveBeenCalledTimes(1);
    expect(resourceHistoryServiceMock.createSnapshot).not.toHaveBeenCalled();
    expect(activityHistoryServiceMock.createSnapshot).not.toHaveBeenCalled();
    expect(result).toEqual({
      topicHistory: mockTopicSnapshot,
      resourceHistories: [],
      activityHistories: [],
    });
  });
});
