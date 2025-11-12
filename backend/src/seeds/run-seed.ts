import typeormConfig from '../config/typeorm.config';
import { seedAdmin } from './admin.seed';

async function runSeeds() {
  const dataSource = await typeormConfig.initialize();

  const shouldSync =
    process.env.SEED_SYNC_SCHEMA !== 'false' &&
    process.env.NODE_ENV !== 'production';

  if (shouldSync) {
    console.log(
      'Sincronizando esquema con entidades (solo entornos no productivos)...',
    );
    await dataSource.synchronize();
  } else {
    console.log(
      'Omitiendo sincronización automática del esquema (SEED_SYNC_SCHEMA=false o NODE_ENV=production).',
    );
  }

  console.log('Ejecutando seeds...\n');

  await seedAdmin(dataSource);

  console.log('\n Seeds ejecutados exitosamente');

  await dataSource.destroy();
}

runSeeds().catch((error) => {
  console.error('❌ Error ejecutando seeds:', error);
  process.exit(1);
});
