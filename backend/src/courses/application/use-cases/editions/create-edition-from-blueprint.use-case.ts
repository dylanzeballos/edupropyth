import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COURSE_REPOSITORY } from '../../../domain/interfaces/course-repository.interface';
import type { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { COURSE_BLUEPRINT_REPOSITORY } from '../../../domain/interfaces/course-blueprint-repository.interface';
import type { ICourseBlueprintRepository } from '../../../domain/interfaces/course-blueprint-repository.interface';
import { TOPIC_REPOSITORY } from '../../../domain/interfaces/topic-repository.interface';
import type { ITopicRepository } from '../../../domain/interfaces/topic-repository.interface';
import { RESOURCE_REPOSITORY } from '../../../domain/interfaces/resource-repository.interface';
import type { IResourceRepository } from '../../../domain/interfaces/resource-repository.interface';
import { ACTIVITY_REPOSITORY } from '../../../domain/interfaces/activity-repository.interface';
import type { IActivityRepository } from '../../../domain/interfaces/activity-repository.interface';
import { Course } from '../../../domain/entities/course.entity';
import { CourseStatus } from '../../../domain/enums/course-status.enum';

interface CreateEditionDto {
  blueprintId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  instructorId?: string;
  sourceCourseId?: string;
}

@Injectable()
export class CreateEditionFromBlueprintUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(COURSE_BLUEPRINT_REPOSITORY)
    private readonly blueprintRepo: ICourseBlueprintRepository,
    @Inject(TOPIC_REPOSITORY)
    private readonly topicRepo: ITopicRepository,
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourceRepo: IResourceRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepo: IActivityRepository,
  ) {}

  async execute(dto: CreateEditionDto): Promise<Course> {
    const blueprint = await this.blueprintRepo.findById(dto.blueprintId);
    if (!blueprint) throw new NotFoundException('Blueprint not found');

    const edition = await this.courseRepo.create({
      title: dto.title,
      description: dto.description,
      thumbnail: dto.thumbnail,
      instructorId: dto.instructorId,
      status: CourseStatus.DRAFT,
      isActive: true,
      blueprintId: dto.blueprintId,
    });

    if (dto.sourceCourseId) {
      const source = await this.courseRepo.findOne(dto.sourceCourseId);
      if (!source) throw new NotFoundException('Source course not found');

      const topics = await this.topicRepo.findByCourseId(source.id);
      for (const topic of topics) {
        const newTopic = await this.topicRepo.create({
          courseId: edition.id,
          title: topic.title,
          description: topic.description,
          order: topic.order,
          isActive: true,
        });

        const resources = await this.resourceRepo.findByTopicId(topic.id);
        for (const resource of resources) {
          await this.resourceRepo.create({
            topicId: newTopic.id,
            title: resource.title,
            description: resource.description,
            type: resource.type,
            url: resource.url,
            publicId: resource.publicId,
            metadata: resource.metadata,
            order: resource.order,
            isActive: true,
          });
        }

        const activities = await this.activityRepo.findByTopicId(topic.id);
        for (const activity of activities) {
          await this.activityRepo.create({
            topicId: newTopic.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            content: activity.content,
            dueDate: activity.dueDate,
            maxScore: activity.maxScore,
            order: activity.order,
            isRequired: activity.isRequired,
            isActive: true,
          });
        }
      }
    }

    return edition;
  }
}
