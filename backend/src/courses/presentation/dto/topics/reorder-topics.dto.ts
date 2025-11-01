import {
  IsArray,
  ValidateNested,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TopicOrderDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  order: number;
}

export class ReorderTopicsDto {
  @ApiProperty({ type: [TopicOrderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopicOrderDto)
  topics: TopicOrderDto[];
}
