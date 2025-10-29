import { DataSource } from 'typeorm';
import { CourseEdition } from '../courses/entities/course-edition.entity';
import { Enrollment, EnrollmentStatus } from '../courses/entities/enrollment.entity';
import { User } from '../auth/domain/entities/user.entity';

interface EnrollmentSeed {
  courseCode: string;
  editionLabel: string;
  studentEmail: string;
  assignedInstructorEmail?: string;
  status?: EnrollmentStatus;
}

const enrollmentsSeed: EnrollmentSeed[] = [
  {
    courseCode: 'PY-BASICO',
    editionLabel: 'II-2025',
    studentEmail: 'student1@edupy.local',
    assignedInstructorEmail: 'encargado@edupy.local',
    status: EnrollmentStatus.ACTIVE,
  },
  {
    courseCode: 'PY-BASICO',
    editionLabel: 'II-2025',
    studentEmail: 'student2@edupy.local',
    assignedInstructorEmail: 'encargado@edupy.local',
    status: EnrollmentStatus.ACTIVE,
  },
  {
    courseCode: 'PY-BASICO',
    editionLabel: 'II-2025',
    studentEmail: 'student3@edupy.local',
    status: EnrollmentStatus.ACTIVE,
  },
];

export const seedEnrollments = async (
  dataSource: DataSource,
): Promise<void> => {
  const editionRepository = dataSource.getRepository(CourseEdition);
  const enrollmentRepository = dataSource.getRepository(Enrollment);
  const userRepository = dataSource.getRepository(User);

  for (const enrollmentSeed of enrollmentsSeed) {
    const edition = await editionRepository
      .createQueryBuilder('edition')
      .innerJoin('edition.course', 'course')
      .where('course.code = :code', { code: enrollmentSeed.courseCode })
      .andWhere('edition.label = :label', { label: enrollmentSeed.editionLabel })
      .getOne();

    if (!edition) {
      console.warn(
        'Edition ' +
          enrollmentSeed.editionLabel +
          ' for course ' +
          enrollmentSeed.courseCode +
          ' not found. Skipping enrollment seeding.',
      );
      continue;
    }

    const student = await userRepository.findOne({
      where: { email: enrollmentSeed.studentEmail },
    });
    if (!student) {
      console.warn(
        'Student ' + enrollmentSeed.studentEmail + ' not found. Skipping.',
      );
      continue;
    }

    let assignedInstructorId: string | null = null;
    if (enrollmentSeed.assignedInstructorEmail) {
      const instructor = await userRepository.findOne({
        where: { email: enrollmentSeed.assignedInstructorEmail },
      });
      if (!instructor) {
        console.warn(
          'Instructor ' +
            enrollmentSeed.assignedInstructorEmail +
            ' not found. Skipping instructor assignment.',
        );
      } else {
        assignedInstructorId = instructor.id;
      }
    }

    const existing = await enrollmentRepository.findOne({
      where: {
        editionId: edition.id,
        studentId: student.id,
      },
    });

    if (existing) {
      existing.assignedInstructorId = assignedInstructorId;
      existing.status = enrollmentSeed.status ?? existing.status;
      existing.completedAt =
        existing.status === EnrollmentStatus.COMPLETED
          ? existing.completedAt
          : null;
      await enrollmentRepository.save(existing);
    } else {
      const enrollment = enrollmentRepository.create({
        editionId: edition.id,
        studentId: student.id,
        assignedInstructorId,
        status: enrollmentSeed.status ?? EnrollmentStatus.ACTIVE,
      });
      await enrollmentRepository.save(enrollment);
    }
  }

  console.log('Seeded ' + enrollmentsSeed.length + ' enrollments');
};
