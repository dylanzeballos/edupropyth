/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import {
  IMediaStorageService,
  UploadResult,
} from '../../domain/interfaces/media-storage.interface';
import { ResourceType } from '../../domain/enums/resource-type.enum';

@Injectable()
export class CloudinaryService implements IMediaStorageService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    resourceType: ResourceType,
  ): Promise<UploadResult> {
    const folder = this.getFolderByResourceType(resourceType);
    const uploadOptions = this.getUploadOptions(resourceType);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, ...uploadOptions },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result) return reject(new Error('Upload failed'));
          resolve(this.mapToUploadResult(result, resourceType));
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(
    publicId: string,
    resourceType: ResourceType,
  ): Promise<void> {
    const type = this.getCloudinaryResourceType(resourceType);
    await cloudinary.uploader.destroy(publicId, { resource_type: type });
  }

  async getSignedUrl(publicId: string): Promise<string> {
    return cloudinary.url(publicId, { secure: true, sign_url: true });
  }

  private getFolderByResourceType(type: ResourceType): string {
    const folders = {
      [ResourceType.SLIDE]: 'courses/slides',
      [ResourceType.VIDEO]: 'courses/videos',
      [ResourceType.AUDIO]: 'courses/audios',
      [ResourceType.DOCUMENT]: 'courses/documents',
    };
    return folders[type] || 'courses/others';
  }

  private getUploadOptions(type: ResourceType) {
    const options: any = { resource_type: 'auto' };

    if (type === ResourceType.VIDEO) {
      options.resource_type = 'video';
      options.eager = [{ streaming_profile: 'hd', format: 'm3u8' }];
    } else if (type === ResourceType.AUDIO) {
      options.resource_type = 'video';
    }

    return options;
  }

  private getCloudinaryResourceType(type: ResourceType): string {
    if (type === ResourceType.VIDEO || type === ResourceType.AUDIO) {
      return 'video';
    }
    return 'auto';
  }

  private mapToUploadResult(
    result: UploadApiResponse,
    resourceType: ResourceType,
  ): UploadResult {
    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType,
      metadata: {
        format: result.format,
        size: result.bytes,
        duration: result.duration,
        width: result.width,
        height: result.height,
      },
    };
  }
}
