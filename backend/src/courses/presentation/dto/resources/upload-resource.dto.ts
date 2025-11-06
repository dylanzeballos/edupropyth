import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceType } from '../../../domain/enums/resource-type.enum';

export class UploadResourceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({ example: 'Video del tema 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ResourceType })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({ example: 1 })
  @Transform(({ value }: { value: string | number }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  @IsNumber()
  @Min(0)
  order: number;
}
