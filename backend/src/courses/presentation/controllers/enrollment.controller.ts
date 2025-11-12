import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards';
import { CurrentUser } from 'src/auth/infrastructure/decorators';
import { User } from 'src/auth/domain/entities/user.entity';
import { EnrollWithKeyDto } from '../dto/groups/enroll-with-key.dto';
import { EnrollWithCodeDto } from '../dto/groups/enroll-with-code.dto';
import { EnrollStudentWithKeyUseCase } from 'src/courses/application/use-cases/groups/enroll-student-with-key.use-case';
import { EnrollStudentWithCodeUseCase } from 'src/courses/application/use-cases/groups/enroll-student-with-code.use-case';
import { GetMyEnrollmentsUseCase } from 'src/courses/application/use-cases/groups/get-my-enrollments.use-case';

@ApiTags('Enrollments')
@ApiBearerAuth()
@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(
    private readonly enrollStudentWithKeyUseCase: EnrollStudentWithKeyUseCase,
    private readonly enrollStudentWithCodeUseCase: EnrollStudentWithCodeUseCase,
    private readonly getMyEnrollmentsUseCase: GetMyEnrollmentsUseCase,
  ) {}

  @Get('my-enrollments')
  @ApiOperation({
    summary: 'Get my enrollments',
    description: 'Get all enrollments for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of enrollments',
  })
  async getMyEnrollments(@CurrentUser() user: User) {
    return await this.getMyEnrollmentsUseCase.execute(user.id);
  }

  @Post('enroll')
  @ApiOperation({
    summary: 'Enroll in a group with enrollment key',
    description:
      'Allows a student to self-enroll in a group using an enrollment key provided by the instructor',
  })
  @ApiBody({ type: EnrollWithKeyDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully enrolled in the group',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid enrollment key, user already enrolled, enrollment period invalid, or group at maximum capacity',
  })
  @ApiResponse({
    status: 403,
    description: 'Enrollment for this group is closed',
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found',
  })
  async enrollWithKey(
    @CurrentUser() user: User,
    @Body() enrollWithKeyDto: EnrollWithKeyDto,
  ) {
    return await this.enrollStudentWithKeyUseCase.execute(
      user.id,
      enrollWithKeyDto.groupId,
      enrollWithKeyDto.enrollmentKey,
    );
  }

  @Post('enroll-with-code')
  @ApiOperation({
    summary: 'Enroll in a group using only enrollment code',
    description:
      'Allows a student to self-enroll by providing only the enrollment code. The system will find the group automatically.',
  })
  @ApiBody({ type: EnrollWithCodeDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully enrolled in the group',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid enrollment code, user already enrolled, enrollment period invalid, or group at maximum capacity',
  })
  @ApiResponse({
    status: 403,
    description: 'Enrollment for this group is closed',
  })
  @ApiResponse({
    status: 404,
    description: 'No group found with that enrollment code',
  })
  async enrollWithCode(
    @CurrentUser() user: User,
    @Body() enrollWithCodeDto: EnrollWithCodeDto,
  ) {
    return await this.enrollStudentWithCodeUseCase.execute(
      user.id,
      enrollWithCodeDto.enrollmentKey,
    );
  }
}
