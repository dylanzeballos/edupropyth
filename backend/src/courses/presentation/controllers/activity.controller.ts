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
import { TopicEditableGuard } from '../../infrastructure/guards/topic-editable.guard';
import { CreateActivityUseCase } from '../../application/use-cases/activities/create-activity.use-case';
import { UpdateActivityUseCase } from '../../application/use-cases/activities/update-activity.use-case';
import { DeleteActivityUseCase } from '../../application/use-cases/activities/delete-activity.use-case';
import { CreateActivityDto } from '../dto/activities/create-activity.dto';
import { UpdateActivityDto } from '../dto/activities/update-activity.dto';
import { ActivityResponseDto } from '../dto/activities/activity-response.dto';

@ApiTags('Activities')
@ApiBearerAuth()
@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(
    private readonly createActivityUseCase: CreateActivityUseCase,
    private readonly updateActivityUseCase: UpdateActivityUseCase,
    private readonly deleteActivityUseCase: DeleteActivityUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({
    status: 201,
    description: 'Activity created',
    type: ActivityResponseDto,
  })
  async create(
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<ActivityResponseDto> {
    return this.createActivityUseCase.execute(createActivityDto);
  }

  @Put(':id')
  @UseGuards(TopicEditableGuard)
  @ApiOperation({ summary: 'Update an activity' })
  @ApiResponse({
    status: 200,
    description: 'Activity updated',
    type: ActivityResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityResponseDto> {
    return this.updateActivityUseCase.execute(id, updateActivityDto);
  }

  @Delete(':id')
  @UseGuards(TopicEditableGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiResponse({ status: 204, description: 'Activity deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteActivityUseCase.execute(id);
  }
}
