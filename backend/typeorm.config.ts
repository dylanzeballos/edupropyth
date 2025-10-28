import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { config as loadEnv } from 'dotenv';
import databaseConfig from './src/config/database.config';

const envFiles = ['.env.local', '.env'].map((file) => join(__dirname, file));
envFiles.forEach((file) => {
  loadEnv({ path: file, override: true });
});

const baseConfig = databaseConfig();

const dataSourceOptions: DataSourceOptions = {
  ...(baseConfig as DataSourceOptions),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
