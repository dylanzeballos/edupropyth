import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../auth/domain/entities/user.entity';
import { EnrollmentsService } from '../services/enrollments.service';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { EnrollmentDto } from '../dto/enrollment-response.dto';
import { ListEnrollmentsQueryDto } from '../dto/list-enrollments.query.dto';
import { PaginatedEnrollmentsResponseDto } from '../dto/course-response.dto';
import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('editions/:editionId/enrollments')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: EnrollmentDto })
  enrollStudent(
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
    @Body() dto: CreateEnrollmentDto,
  ) {
    return this.enrollmentsService.createEnrollment(editionId, dto);
  }

  @Get('editions/:editionId/enrollments')
  @ApiOkResponse({ type: PaginatedEnrollmentsResponseDto })
  listEnrollments(
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
    @Query() query: ListEnrollmentsQueryDto,
  ) {
    return this.enrollmentsService.listEnrollments(editionId, query);
  }

  @Patch('enrollments/:enrollmentId')
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: EnrollmentDto })
  updateEnrollment(
    @Param('enrollmentId', new ParseUUIDPipe()) enrollmentId: string,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.updateEnrollment(enrollmentId, dto);
  }

  @Delete('enrollments/:enrollmentId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Enrollment removed' })
  removeEnrollment(
    @Param('enrollmentId', new ParseUUIDPipe()) enrollmentId: string,
  ) {
    return this.enrollmentsService.removeEnrollment(enrollmentId);
  }
}
