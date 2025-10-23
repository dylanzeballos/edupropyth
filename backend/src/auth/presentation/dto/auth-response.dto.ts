import { UserRole } from '../../domain/entities/user.entity';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDataDto;
}

export class UserDataDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}
