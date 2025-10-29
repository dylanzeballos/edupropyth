import { DataSource } from 'typeorm';
import { Course } from '../courses/entities/course.entity';

const coursesSeed = [
  {
    code: 'PY-BASICO',
    name: 'Programación con Python',
    slug: 'programacion-con-python',
    description:
      'Curso introductorio para aprender los fundamentos de Python orientado a estudiantes de primer semestre.',
  },
];

export const seedCourses = async (dataSource: DataSource): Promise<void> => {
  const courseRepository = dataSource.getRepository(Course);

  for (const courseData of coursesSeed) {
    const existing = await courseRepository.findOne({
      where: { code: courseData.code },
      withDeleted: true,
    });

    if (existing) {
      existing.name = courseData.name;
      existing.slug = courseData.slug;
      existing.description = courseData.description;
      existing.isActive = true;
      await courseRepository.save(existing);
    } else {
      const course = courseRepository.create(courseData);
      await courseRepository.save(course);
    }
  }

  console.log('Seeded ' + coursesSeed.length + ' courses');
};
