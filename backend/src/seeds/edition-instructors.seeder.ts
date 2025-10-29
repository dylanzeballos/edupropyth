import { DataSource } from 'typeorm';
import { CourseEdition } from '../courses/entities/course-edition.entity';
import { EditionInstructor, EditionInstructorRole } from '../courses/entities/edition-instructor.entity';
import { User } from '../auth/domain/entities/user.entity';

interface EditionInstructorSeed {
  editionLabel: string;
  courseCode: string;
  instructorEmail: string;
  role: EditionInstructorRole;
}

const editionInstructorsSeed: EditionInstructorSeed[] = [
  {
    courseCode: 'PY-BASICO',
    editionLabel: 'II-2025',
    instructorEmail: 'instructor@edupy.local',
    role: EditionInstructorRole.INSTRUCTOR,
  },
  {
    courseCode: 'PY-BASICO',
    editionLabel: 'II-2025',
    instructorEmail: 'encargado@edupy.local',
    role: EditionInstructorRole.ENCARGADO,
  },
];

export const seedEditionInstructors = async (
  dataSource: DataSource,
): Promise<void> => {
  const editionRepository = dataSource.getRepository(CourseEdition);
  const instructorRepository = dataSource.getRepository(EditionInstructor);
  const userRepository = dataSource.getRepository(User);

  for (const assignment of editionInstructorsSeed) {
    const edition = await editionRepository
      .createQueryBuilder('edition')
      .innerJoin('edition.course', 'course')
      .where('course.code = :code', { code: assignment.courseCode })
      .andWhere('edition.label = :label', { label: assignment.editionLabel })
      .getOne();

    if (!edition) {
      console.warn(
        'Edition ' + assignment.editionLabel +
          ' for course ' +
          assignment.courseCode +
          ' not found. Skipping instructor seeding.',
      );
      continue;
    }

    const instructor = await userRepository.findOne({
      where: { email: assignment.instructorEmail },
    });

    if (!instructor) {
      console.warn(
        'Instructor ' +
          assignment.instructorEmail +
          ' not found. Skipping instructor seeding.',
      );
      continue;
    }

    let existing = await instructorRepository.findOne({
      where: {
        editionId: edition.id,
        instructorId: instructor.id,
        role: assignment.role,
      },
    });

    if (existing) {
      existing.unassignedAt = null;
      existing.assignedAt = new Date();
      await instructorRepository.save(existing);
    } else {
      const record = instructorRepository.create({
        editionId: edition.id,
        instructorId: instructor.id,
        role: assignment.role,
      });
      await instructorRepository.save(record);
    }
  }

  console.log('Seeded ' + editionInstructorsSeed.length + ' edition instructors');
};
