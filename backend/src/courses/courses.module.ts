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

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseEdition, EditionInstructor, Enrollment]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, JwtAuthGuard, RolesGuard],
  exports: [CoursesService],
})
export class CoursesModule {}
