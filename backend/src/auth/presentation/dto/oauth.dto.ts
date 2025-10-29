import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  id_token: string;
}

export class GithubLoginDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class MicrosoftLoginDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
