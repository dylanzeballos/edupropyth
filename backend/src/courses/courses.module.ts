import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CourseEdition } from './entities/course-edition.entity';
import { EditionInstructor } from './entities/edition-instructor.entity';
import { Enrollment } from './entities/enrollment.entity';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/infrastructure/guards/roles.guard';
import { EditionInstructorsController } from './controllers/edition-instructors.controller';
import { EnrollmentsController } from './controllers/enrollments.controller';
import { EditionInstructorsService } from './services/edition-instructors.service';
import { EnrollmentsService } from './services/enrollments.service';
import { User } from '../auth/domain/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      CourseEdition,
      EditionInstructor,
      Enrollment,
      User,
    ]),
  ],
  controllers: [
    CoursesController,
    EditionInstructorsController,
    EnrollmentsController,
  ],
  providers: [
    CoursesService,
    EditionInstructorsService,
    EnrollmentsService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
