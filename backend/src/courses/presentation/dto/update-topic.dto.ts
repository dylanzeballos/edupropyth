import { PartialType } from '@nestjs/mapped-types';
import { CreateTopicDto } from './create-topic.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
