import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Test } from '@nestjs/testing';
import { config as dotenvConfig } from 'dotenv';

let dataSource: DataSource | null = null;
let app: INestApplication | null = null;

export const bootstrapTestingApp = async (): Promise<INestApplication> => {
  if (!app) {
    dotenvConfig({ path: '.env.test' });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.runMigrations();
  }
  return app;
};

export const shutdownTestingApp = async (): Promise<void> => {
  if (dataSource) {
    await dataSource.destroy();
    dataSource = null;
  }
  if (app) {
    await app.close();
    app = null;
  }
};

export const truncateDatabase = async (): Promise<void> => {
  if (!dataSource) {
    throw new Error('DataSource not initialized. Call bootstrapTestingApp first.');
  }

  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    if (entity.tableName === 'typeorm_migrations') {
      continue;
    }
    const repository = dataSource.getRepository(entity.name);
    await repository.query(
      `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`,
    );
  }
};
