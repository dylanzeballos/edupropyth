import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CourseStatusGuard } from '../../infrastructure/guards/course-status.guard';
import { TopicEditableGuard } from '../../infrastructure/guards/topic-editable.guard';
import { AllowedCourseStatuses } from '../../infrastructure/decorators/allowed-course-statuses.decorator';
import { CourseStatus } from '../../domain/enums/course-status.enum';
import { CreateTopicUseCase } from '../../application/use-cases/topics/create-topic.use-case';
import { UpdateTopicUseCase } from '../../application/use-cases/topics/update-topic.use-case';
import { DeleteTopicUseCase } from '../../application/use-cases/topics/delete-topic.use-case';
import { ReorderTopicsUseCase } from '../../application/use-cases/topics/reorder-topics.use-case';
import { CreateTopicDto } from '../dto/topics/create-topic.dto';
import { UpdateTopicDto } from '../dto/topics/update-topic.dto';
import { ReorderTopicsDto } from '../dto/topics/reorder-topics.dto';
import { TopicResponseDto } from '../dto/topics/topic-response.dto';

@ApiTags('Topics')
@ApiBearerAuth()
@Controller('topics')
@UseGuards(JwtAuthGuard)
export class TopicController {
  constructor(
    private readonly createTopicUseCase: CreateTopicUseCase,
    private readonly updateTopicUseCase: UpdateTopicUseCase,
    private readonly deleteTopicUseCase: DeleteTopicUseCase,
    private readonly reorderTopicsUseCase: ReorderTopicsUseCase,
  ) {}

  @Post()
  @UseGuards(CourseStatusGuard)
  @AllowedCourseStatuses(CourseStatus.DRAFT, CourseStatus.ACTIVE)
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({
    status: 201,
    description: 'Topic created',
    type: TopicResponseDto,
  })
  async create(
    @Body() createTopicDto: CreateTopicDto,
  ): Promise<TopicResponseDto> {
    return this.createTopicUseCase.execute(createTopicDto);
  }

  @Put(':id')
  @UseGuards(TopicEditableGuard)
  @ApiOperation({ summary: 'Update a topic' })
  @ApiResponse({
    status: 200,
    description: 'Topic updated',
    type: TopicResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<TopicResponseDto> {
    return this.updateTopicUseCase.execute(id, updateTopicDto);
  }

  @Delete(':id')
  @UseGuards(TopicEditableGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a topic' })
  @ApiResponse({ status: 204, description: 'Topic deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteTopicUseCase.execute(id);
  }

  @Put('courses/:courseId/reorder')
  @UseGuards(CourseStatusGuard)
  @AllowedCourseStatuses(CourseStatus.DRAFT, CourseStatus.ACTIVE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reorder topics in a course' })
  @ApiResponse({ status: 204, description: 'Topics reordered' })
  async reorder(
    @Param('courseId') courseId: string,
    @Body() reorderDto: ReorderTopicsDto,
  ): Promise<void> {
    return this.reorderTopicsUseCase.execute(courseId, reorderDto.topics);
  }
}
