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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EditionInstructorsService } from '../services/edition-instructors.service';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../auth/domain/entities/user.entity';
import { AddEditionInstructorDto } from '../dto/add-edition-instructor.dto';
import { EditionInstructorDto } from '../dto/edition-instructor-response.dto';
import { UpdateEditionInstructorDto } from '../dto/update-edition-instructor.dto';

@ApiTags('Edition Instructors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('editions/:editionId/instructors')
export class EditionInstructorsController {
  constructor(private readonly editionInstructorsService: EditionInstructorsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: EditionInstructorDto })
  addInstructor(
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
    @Body() dto: AddEditionInstructorDto,
  ) {
    return this.editionInstructorsService.addInstructor(editionId, dto);
  }

  @Get()
  @ApiOkResponse({ type: EditionInstructorDto, isArray: true })
  listInstructors(
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
  ) {
    return this.editionInstructorsService.listInstructors(editionId);
  }

  @Patch(':instructorId')
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ type: EditionInstructorDto })
  updateInstructor(
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
    @Param('instructorId', new ParseUUIDPipe()) instructorId: string,
    @Body() dto: UpdateEditionInstructorDto,
  ) {
    return this.editionInstructorsService.updateInstructor(
      editionId,
      instructorId,
      dto,
    );
  }

  @Delete(':instructorId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Instructor assignment removed' })
  removeInstructor(
    @Param('editionId', new ParseUUIDPipe()) editionId: string,
    @Param('instructorId', new ParseUUIDPipe()) instructorId: string,
  ) {
    return this.editionInstructorsService.removeInstructor(
      editionId,
      instructorId,
    );
  }
}
