import { ResourceType } from '../enums/resource-type.enum';

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: ResourceType;
  metadata: {
    format?: string;
    size?: number;
    duration?: number;
    width?: number;
    height?: number;
  };
}

export interface IMediaStorageService {
  uploadFile(
    file: Express.Multer.File,
    resourceType: ResourceType,
  ): Promise<UploadResult>;
  deleteFile(publicId: string, resourceType: ResourceType): Promise<void>;
  getSignedUrl(publicId: string): Promise<string>;
}

export const MEDIA_STORAGE_SERVICE = Symbol('MEDIA_STORAGE_SERVICE');
