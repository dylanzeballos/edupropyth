import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ResourceHistoryService } from '../application/services/resource-history.service';
import { ResourceHistory } from '../domain/entities/resource-history.entity';
import { Resource } from '../../courses/domain/entities/resource.entity';
import { ResourceType } from '../../courses/domain/enums/resource-type.enum';
import { HistoryAction } from '../domain/enums/history-action.enum';
import { User, UserRole } from '../../auth/domain/entities/user.entity';

type ResourceHistoryRepositoryMock = jest.Mocked<
  Pick<Repository<ResourceHistory>, 'create' | 'save' | 'find' | 'findOne'>
>;

const createResourceHistoryRepositoryMock =
  (): ResourceHistoryRepositoryMock => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  });

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

const buildResourceHistory = (
  overrides?: Partial<ResourceHistory>,
): ResourceHistory => {
  const history = new ResourceHistory();
  history.id = 'resource-history-1';
  history.resourceId = 'resource-1';
  history.topicId = 'topic-1';
  history.version = 1;
  history.action = HistoryAction.UPDATE;
  history.changes = { title: 'Updated resource' };
  history.previousData = { title: 'Original resource' };
  history.currentData = { title: 'Updated resource' };
  history.editedById = 'user-1';
  history.editedAt = new Date();
  return Object.assign(history, overrides);
};

describe('ResourceHistoryService', () => {
  let service: ResourceHistoryService;
  let resourceHistoryRepository: ResourceHistoryRepositoryMock;

  const mockUser = buildUser();
  const mockResource = buildResource();

  beforeEach(async () => {
    resourceHistoryRepository = createResourceHistoryRepositoryMock();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceHistoryService,
        {
          provide: getRepositoryToken(ResourceHistory),
          useValue: resourceHistoryRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<ResourceHistoryService>(ResourceHistoryService);
  });

  describe('createSnapshot', () => {
    it('should persist a resource snapshot with the next version number', async () => {
      const historyEntry = buildResourceHistory({ version: 3 });
      resourceHistoryRepository.create.mockReturnValue(historyEntry);
      resourceHistoryRepository.save.mockResolvedValue(historyEntry);
      resourceHistoryRepository.findOne.mockResolvedValueOnce(
        buildResourceHistory({ version: 2 }),
      );

      const result = await service.createSnapshot(
        mockResource,
        mockUser,
        HistoryAction.UPDATE,
        { title: 'Updated resource' },
        { title: 'Original resource' },
      );

      expect(resourceHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceId: mockResource.id,
          topicId: mockResource.topicId,
          action: HistoryAction.UPDATE,
          changes: { title: 'Updated resource' },
          previousData: { title: 'Original resource' },
          currentData: { title: 'Updated resource' },
          editedBy: mockUser,
          editedById: mockUser.id,
          version: 3,
        }),
      );
      expect(resourceHistoryRepository.save).toHaveBeenCalledWith(historyEntry);
      expect(result).toEqual(historyEntry);
    });

    it('should reject non editor users', async () => {
      const studentUser = { ...mockUser, role: UserRole.STUDENT };

      await expect(
        service.createSnapshot(
          mockResource,
          studentUser,
          HistoryAction.UPDATE,
          {},
          {},
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getResourceHistory', () => {
    it('should fetch ordered history for authorized users', async () => {
      const historyEntry = buildResourceHistory();
      resourceHistoryRepository.find.mockResolvedValue([historyEntry]);

      const result = await service.getResourceHistory(
        mockResource.id,
        mockUser,
      );

      expect(resourceHistoryRepository.find).toHaveBeenCalledWith({
        where: { resourceId: mockResource.id },
        relations: ['editedBy'],
        order: { version: 'DESC' },
      });
      expect(result).toEqual([historyEntry]);
    });

    it('should throw ForbiddenException for unauthorized users', async () => {
      const studentUser = { ...mockUser, role: UserRole.STUDENT };

      await expect(
        service.getResourceHistory(mockResource.id, studentUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getVersionById', () => {
    it('should return the requested resource version', async () => {
      const historyEntry = buildResourceHistory();
      resourceHistoryRepository.findOne.mockResolvedValue(historyEntry);

      const result = await service.getVersionById(
        'resource-history-1',
        mockUser,
      );

      expect(resourceHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'resource-history-1' },
        relations: ['editedBy'],
      });
      expect(result).toEqual(historyEntry);
    });

    it('should throw NotFoundException when history does not exist', async () => {
      resourceHistoryRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getVersionById('missing-id', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('compareVersions', () => {
    it('should return diff between two versions', async () => {
      const olderVersion = buildResourceHistory({ version: 1 });
      const newerVersion = buildResourceHistory({
        id: 'resource-history-2',
        version: 2,
        currentData: { title: 'Newer title' },
      });

      resourceHistoryRepository.findOne
        .mockResolvedValueOnce(olderVersion)
        .mockResolvedValueOnce(newerVersion);

      const result = await service.compareVersions(
        mockResource.id,
        1,
        2,
        mockUser,
      );

      expect(result.resourceId).toBe(mockResource.id);
      expect(result.version1).toEqual(olderVersion);
      expect(result.version2).toEqual(newerVersion);
      expect(result.differences).toBeDefined();
    });

    it('should throw NotFoundException if any version cannot be found', async () => {
      resourceHistoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.compareVersions(mockResource.id, 1, 2, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getNextVersion', () => {
    it('should increment from the latest version', async () => {
      resourceHistoryRepository.findOne.mockResolvedValue(
        buildResourceHistory({ version: 7 }),
      );

      await expect(service.getNextVersion(mockResource.id)).resolves.toBe(8);
    });

    it('should start at version 1 when no history is stored', async () => {
      resourceHistoryRepository.findOne.mockResolvedValue(null);

      await expect(service.getNextVersion(mockResource.id)).resolves.toBe(1);
    });
  });
});
