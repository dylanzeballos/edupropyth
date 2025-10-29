import { DataSource } from 'typeorm';
import dataSource from '../../../typeorm.config';

export const initializeDataSource = async (): Promise<DataSource> => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
};

export const destroyDataSource = async (): Promise<void> => {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
};
