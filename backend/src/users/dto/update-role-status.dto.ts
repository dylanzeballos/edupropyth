import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserStatusDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
