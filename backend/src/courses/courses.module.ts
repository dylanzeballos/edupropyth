import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './domain/entities/course.entity';
import { Topic } from './domain/entities/topic.entity';
import { COURSE_REPOSITORY } from './domain/interfaces/course-repository.interface';
import { TOPIC_REPOSITORY } from './domain/interfaces/topic-repository.interface';

import { TypeOrmCourseRepository } from './infrastructure/persistence/typeorm-course.repository';
import { TypeOrmTopicRepository } from './infrastructure/persistence/typeorm-topic.repository';
import { CourseAdminGuard } from './infrastructure/guards/course-admin.guard';
import { CourseEditorGuard } from './infrastructure/guards/course-editor.guard';

import { CreateCourseUseCase } from './application/use-cases/create-course.use-case';
import { GetCourseUseCase } from './application/use-cases/get-course.use-case';
import { UpdateCourseUseCase } from './application/use-cases/update-course.use-case';

import { CoursesController } from './presentation/controllers/course.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Topic])],
  controllers: [CoursesController],
  providers: [
    {
      provide: COURSE_REPOSITORY,
      useClass: TypeOrmCourseRepository,
    },
    {
      provide: TOPIC_REPOSITORY,
      useClass: TypeOrmTopicRepository,
    },

    CourseAdminGuard,
    CourseEditorGuard,

    CreateCourseUseCase,
    GetCourseUseCase,
    UpdateCourseUseCase,
  ],
  exports: [CreateCourseUseCase, GetCourseUseCase, UpdateCourseUseCase],
})
export class CoursesModule {}
