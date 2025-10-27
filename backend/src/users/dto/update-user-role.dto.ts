import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { UserRole } from '../../auth/domain/entities/user.entity';

export class UpdateUserRoleDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
