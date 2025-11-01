import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IResourceRepository } from '../../../domain/interfaces/resource-repository.interface';
import { RESOURCE_REPOSITORY } from '../../../domain/interfaces/resource-repository.interface';
import type { IMediaStorageService } from '../../../domain/interfaces/media-storage.interface';
import { MEDIA_STORAGE_SERVICE } from '../../../domain/interfaces/media-storage.interface';

@Injectable()
export class DeleteResourceUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
    @Inject(MEDIA_STORAGE_SERVICE)
    private mediaStorageService: IMediaStorageService,
  ) {}

  async execute(id: string): Promise<void> {
    const resource = await this.resourceRepository.findById(id);

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (resource.publicId) {
      await this.mediaStorageService.deleteFile(
        resource.publicId,
        resource.type,
      );
    }

    await this.resourceRepository.delete(id);
  }
}
