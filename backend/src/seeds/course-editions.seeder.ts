import { DataSource } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import {
  CourseEdition,
  CourseEditionStatus,
} from '../courses/entities/course-edition.entity';

interface EditionSeed {
  courseCode: string;
  label: string;
  term: string;
  year: number;
  startDate: string;
  endDate: string;
  status: CourseEditionStatus;
}

const editionsSeed: EditionSeed[] = [
  {
    courseCode: 'PY-BASICO',
    label: 'II-2025',
    term: 'II',
    year: 2025,
    startDate: '2025-08-01T00:00:00Z',
    endDate: '2025-12-15T00:00:00Z',
    status: CourseEditionStatus.ONGOING,
  },
];

export const seedCourseEditions = async (
  dataSource: DataSource,
): Promise<void> => {
  const courseRepository = dataSource.getRepository(Course);
  const editionRepository = dataSource.getRepository(CourseEdition);

  for (const editionData of editionsSeed) {
    const course = await courseRepository.findOne({
      where: { code: editionData.courseCode },
    });
    if (!course) {
      console.warn(
        'Course with code ' +
          editionData.courseCode +
          ' not found. Skipping edition ' +
          editionData.label,
      );
      continue;
    }

    const existing = await editionRepository.findOne({
      where: {
        courseId: course.id,
        label: editionData.label,
      },
    });

    const payload = {
      courseId: course.id,
      label: editionData.label,
      term: editionData.term,
      year: editionData.year,
      startDate: new Date(editionData.startDate),
      endDate: new Date(editionData.endDate),
      status: editionData.status,
    };

    if (existing) {
      Object.assign(existing, payload, {
        archivedAt: null,
        archivedByUserId: null,
      });
      await editionRepository.save(existing);
    } else {
      const edition = editionRepository.create(payload);
      await editionRepository.save(edition);
    }
  }

  console.log('Seeded ' + editionsSeed.length + ' course editions');
};
