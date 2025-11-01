import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Course } from './domain/entities/course.entity';
import { Topic } from './domain/entities/topic.entity';
import { Resource } from './domain/entities/resource.entity';
import { Activity } from './domain/entities/activity.entity';

import { COURSE_REPOSITORY } from './domain/interfaces/course-repository.interface';
import { TOPIC_REPOSITORY } from './domain/interfaces/topic-repository.interface';
import { RESOURCE_REPOSITORY } from './domain/interfaces/resource-repository.interface';
import { ACTIVITY_REPOSITORY } from './domain/interfaces/activity-repository.interface';
import { MEDIA_STORAGE_SERVICE } from './domain/interfaces/media-storage.interface';

import { TypeOrmCourseRepository } from './infrastructure/persistence/typeorm-course.repository';
import { TypeOrmTopicRepository } from './infrastructure/persistence/typeorm-topic.repository';
import { TypeOrmResourceRepository } from './infrastructure/persistence/typeorm-resource.repository';
import { TypeOrmActivityRepository } from './infrastructure/persistence/typeorm-activity.repository';

import { CloudinaryService } from './infrastructure/services/cloudinary.service';

import { CourseAdminGuard } from './infrastructure/guards/course-admin.guard';
import { CourseEditorGuard } from './infrastructure/guards/course-editor.guard';
import { CourseStatusGuard } from './infrastructure/guards/course-status.guard';
import { TopicEditableGuard } from './infrastructure/guards/topic-editable.guard';

// Use Cases - Topics
import { CreateTopicUseCase } from './application/use-cases/topics/create-topic.use-case';
import { UpdateTopicUseCase } from './application/use-cases/topics/update-topic.use-case';
import { DeleteTopicUseCase } from './application/use-cases/topics/delete-topic.use-case';
import { ReorderTopicsUseCase } from './application/use-cases/topics/reorder-topics.use-case';
import { CloneTopicToHistoricUseCase } from './application/use-cases/topics/clone-topic-to-historic.use-case';

// Use Cases - Resources
import { CreateResourceUseCase } from './application/use-cases/resources/create-resource.use-case';
import { UpdateResourceUseCase } from './application/use-cases/resources/update-resource.use-case';
import { DeleteResourceUseCase } from './application/use-cases/resources/delete-resource.use-case';
import { UploadResourceUseCase } from './application/use-cases/resources/upload-resource.use-case';

// Use Cases - Activities
import { CreateActivityUseCase } from './application/use-cases/activities/create-activity.use-case';
import { UpdateActivityUseCase } from './application/use-cases/activities/update-activity.use-case';
import { DeleteActivityUseCase } from './application/use-cases/activities/delete-activity.use-case';

// Use Cases - Courses
import { CreateCourseUseCase } from './application/use-cases/create-course.use-case';
import { GetCourseUseCase } from './application/use-cases/get-course.use-case';
import { UpdateCourseUseCase } from './application/use-cases/update-course.use-case';

import { CoursesController } from './presentation/controllers/course.controller';
import { TopicController } from './presentation/controllers/topic.controller';
import { ResourceController } from './presentation/controllers/resource.controller';
import { ActivityController } from './presentation/controllers/activity.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Topic, Resource, Activity]),
    ConfigModule,
  ],
  controllers: [
    CoursesController,
    TopicController,
    ResourceController,
    ActivityController,
  ],
  providers: [
    {
      provide: COURSE_REPOSITORY,
      useClass: TypeOrmCourseRepository,
    },
    {
      provide: TOPIC_REPOSITORY,
      useClass: TypeOrmTopicRepository,
    },
    {
      provide: RESOURCE_REPOSITORY,
      useClass: TypeOrmResourceRepository,
    },
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: TypeOrmActivityRepository,
    },
    {
      provide: MEDIA_STORAGE_SERVICE,
      useClass: CloudinaryService,
    },

    CourseStatusGuard,
    TopicEditableGuard,
    CourseAdminGuard,
    CourseEditorGuard,

    CloudinaryService,

    // Use Cases - Topics
    CreateTopicUseCase,
    UpdateTopicUseCase,
    DeleteTopicUseCase,
    ReorderTopicsUseCase,
    CloneTopicToHistoricUseCase,

    // Use Cases - Resources
    CreateResourceUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
    UploadResourceUseCase,

    // Use Cases - Activities
    CreateActivityUseCase,
    UpdateActivityUseCase,
    DeleteActivityUseCase,

    // Use Cases - Courses
    CreateCourseUseCase,
    GetCourseUseCase,
    UpdateCourseUseCase,
  ],
  exports: [
    CreateCourseUseCase,
    GetCourseUseCase,
    UpdateCourseUseCase,
    CloudinaryService,
  ],
})
export class CoursesModule {}
