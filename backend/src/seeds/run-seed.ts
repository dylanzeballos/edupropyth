import typeormConfig from '../config/typeorm.config';
import { seedAdmin } from './admin.seed';

async function runSeeds() {
  const dataSource = await typeormConfig.initialize();

  console.log('Ejecutando seeds...\n');

  await seedAdmin(dataSource);

  console.log('\n Seeds ejecutados exitosamente');

  await dataSource.destroy();
}

runSeeds().catch((error) => {
  console.error('❌ Error ejecutando seeds:', error);
  process.exit(1);
});
