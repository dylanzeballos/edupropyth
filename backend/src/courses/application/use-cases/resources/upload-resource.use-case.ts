import { Inject, Injectable } from '@nestjs/common';
import type { IResourceRepository } from '../../../domain/interfaces/resource-repository.interface';
import { RESOURCE_REPOSITORY } from '../../../domain/interfaces/resource-repository.interface';
import type { IMediaStorageService } from '../../../domain/interfaces/media-storage.interface';
import { MEDIA_STORAGE_SERVICE } from '../../../domain/interfaces/media-storage.interface';
import { Resource } from '../../../domain/entities/resource.entity';
import { ResourceType } from '../../../domain/enums/resource-type.enum';

@Injectable()
export class UploadResourceUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
    @Inject(MEDIA_STORAGE_SERVICE)
    private mediaStorageService: IMediaStorageService,
  ) {}

  async execute(
    file: Express.Multer.File,
    topicId: string,
    title: string,
    description: string | undefined,
    type: ResourceType,
    order: number,
  ): Promise<Resource> {
    const uploadResult = await this.mediaStorageService.uploadFile(file, type);

    return this.resourceRepository.create({
      topicId,
      title,
      description,
      type,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      metadata: uploadResult.metadata,
      order,
      isActive: true,
    });
  }
}
