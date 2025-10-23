import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default_secret-change-me',
  expiresIn: process.env.JWT_EXPIRATION || '7d',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || 'default_refresh_secret-change-me',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
}));
