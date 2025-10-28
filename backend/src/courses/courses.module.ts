import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CourseEdition } from './entities/course-edition.entity';
import { EditionInstructor } from './entities/edition-instructor.entity';
import { Enrollment } from './entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseEdition, EditionInstructor, Enrollment]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
