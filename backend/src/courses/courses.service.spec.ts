import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CourseEdition } from './entities/course-edition.entity';
import { EditionInstructor } from './entities/edition-instructor.entity';
import { Enrollment } from './entities/enrollment.entity';

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CourseEdition),
          useValue: {},
        },
        {
          provide: getRepositoryToken(EditionInstructor),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Enrollment),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
