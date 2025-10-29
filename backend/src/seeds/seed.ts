import { initializeDataSource, destroyDataSource } from './utils/datasource';
import { seedUsers } from './users.seeder';
import { seedCourses } from './courses.seeder';
import { seedCourseEditions } from './course-editions.seeder';
import { seedEditionInstructors } from './edition-instructors.seeder';
import { seedEnrollments } from './enrollments.seeder';

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seeding in production is not allowed');
  }

  const dataSource = await initializeDataSource();

  try {
    console.log('>> Running database seed...');
    await seedUsers(dataSource);
    await seedCourses(dataSource);
    await seedCourseEditions(dataSource);
    await seedEditionInstructors(dataSource);
    await seedEnrollments(dataSource);
    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await destroyDataSource();
  }
}

void bootstrap();
