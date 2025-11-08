import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateEditionDto {
  @ApiProperty()
  @IsUUID()
  blueprintId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  instructorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  sourceCourseId?: string;
}
