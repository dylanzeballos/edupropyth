import { DataSource } from 'typeorm';
import { seedUsers } from '../../src/seeds/users.seeder';
import { seedCourses } from '../../src/seeds/courses.seeder';
import { seedCourseEditions } from '../../src/seeds/course-editions.seeder';
import { seedEditionInstructors } from '../../src/seeds/edition-instructors.seeder';
import { seedEnrollments } from '../../src/seeds/enrollments.seeder';

export const seedTestData = async (dataSource: DataSource): Promise<void> => {
  await seedUsers(dataSource);
  await seedCourses(dataSource);
  await seedCourseEditions(dataSource);
  await seedEditionInstructors(dataSource);
  await seedEnrollments(dataSource);
};
