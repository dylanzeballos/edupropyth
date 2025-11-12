import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ResourceHistoryService } from '../application/services/resource-history.service';
import { ResourceHistory } from '../domain/entities/resource-history.entity';
import { Resource } from '../../courses/domain/entities/resource.entity';
import { ResourceType } from '../../courses/domain/enums/resource-type.enum';
import { HistoryAction } from '../domain/enums/history-action.enum';
import { User, UserRole } from '../../auth/domain/entities/user.entity';
describe('ResourceHistoryService', () => {
  let service: ResourceHistoryService;
  let resourceHistoryRepository: Repository<ResourceHistory>;
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
  const mockHistory: ResourceHistory = {
    id: 'resource-history-1',
    resourceId: mockResource.id,
    topicId: mockResource.topicId,
    version: 1,
    action: HistoryAction.UPDATE,
    changes: { title: 'Updated resource' },
    previousData: { title: 'Original resource' },
    currentData: { title: 'Updated resource' },
    editedBy: mockUser,
    editedAt: new Date(),
  } as ResourceHistory;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceHistoryService,
        {
          provide: getRepositoryToken(ResourceHistory),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<ResourceHistoryService>(ResourceHistoryService);
    resourceHistoryRepository = module.get<Repository<ResourceHistory>>(
      getRepositoryToken(ResourceHistory),
    );
  });
  describe('createSnapshot', () => {
    it('should persist a resource snapshot with the next version number', async () => {
      jest.spyOn(service, 'getNextVersion').mockResolvedValue(3);
      const createSpy = jest
        .spyOn(resourceHistoryRepository, 'create')
        .mockReturnValue(mockHistory);
      const saveSpy = jest
        .spyOn(resourceHistoryRepository, 'save')
        .mockResolvedValue(mockHistory);
      const result = await service.createSnapshot(
        mockResource,
        mockUser,
        HistoryAction.UPDATE,
        { title: 'Updated resource' },
        { title: 'Original resource' },
      );
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceId: mockResource.id,
          topicId: mockResource.topicId,
          action: HistoryAction.UPDATE,
          changes: { title: 'Updated resource' },
          previousData: { title: 'Original resource' },
          currentData: { title: 'Updated resource' },
          editedBy: mockUser,
          version: 3,
        }),
      );
      expect(saveSpy).toHaveBeenCalledWith(mockHistory);
      expect(result).toEqual(mockHistory);
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
      jest
        .spyOn(resourceHistoryRepository, 'find')
        .mockResolvedValue([mockHistory]);
      const result = await service.getResourceHistory(
        mockResource.id,
        mockUser,
      );
      expect(resourceHistoryRepository.find).toHaveBeenCalledWith({
        where: { resourceId: mockResource.id },
        relations: ['editedBy'],
        order: { version: 'DESC' },
      });
      expect(result).toEqual([mockHistory]);
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
      jest
        .spyOn(resourceHistoryRepository, 'findOne')
        .mockResolvedValue(mockHistory);
      const result = await service.getVersionById(
        'resource-history-1',
        mockUser,
      );
      expect(resourceHistoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'resource-history-1' },
        relations: ['editedBy'],
      });
      expect(result).toEqual(mockHistory);
    });
    it('should throw NotFoundException when history does not exist', async () => {
      jest.spyOn(resourceHistoryRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.getVersionById('missing-id', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('compareVersions', () => {
    it('should return diff between two versions', async () => {
      const olderVersion = { ...mockHistory, version: 1 };
      const newerVersion = {
        ...mockHistory,
        id: 'resource-history-2',
        version: 2,
        currentData: { title: 'Newer title' },
      };
      jest
        .spyOn(resourceHistoryRepository, 'findOne')
        .mockResolvedValueOnce(olderVersion)
        .mockResolvedValueOnce(newerVersion);
      const result = await service.compareVersions(
        mockResource.id,
        1,
        2,
        mockUser,
      );
      expect(result).toMatchObject({
        resourceId: mockResource.id,
        version1: olderVersion,
        version2: newerVersion,
        differences: expect.any(Object),
      });
    });
    it('should throw NotFoundException if any version cannot be found', async () => {
      jest
        .spyOn(resourceHistoryRepository, 'findOne')
        .mockResolvedValueOnce(null);
      await expect(
        service.compareVersions(mockResource.id, 1, 2, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('getNextVersion', () => {
    it('should increment from the latest version', async () => {
      jest
        .spyOn(resourceHistoryRepository, 'findOne')
        .mockResolvedValue({ version: 7 } as ResourceHistory);
      await expect(
        service.getNextVersion(mockResource.id),
      ).resolves.toBe(8);
    });
    it('should start at version 1 when no history is stored', async () => {
      jest.spyOn(resourceHistoryRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.getNextVersion(mockResource.id),
      ).resolves.toBe(1);
    });
  });
});