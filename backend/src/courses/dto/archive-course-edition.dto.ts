import { IsOptional, IsUUID } from 'class-validator';

export class ArchiveCourseEditionDto {
  @IsOptional()
  @IsUUID()
  archivedByUserId?: string;
}
