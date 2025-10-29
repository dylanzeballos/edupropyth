import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost',
    port: parseInt(
      process.env.DB_PORT || process.env.DATABASE_PORT || '5432',
      10,
    ),
    username:
      process.env.DB_USERNAME || process.env.DATABASE_USERNAME || 'postgres',
    password:
      process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || 'postgres',
    database:
      process.env.DB_DATABASE || process.env.DATABASE_NAME || 'edupropyth',
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  }),
);
