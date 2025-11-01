import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { TopicEditableGuard } from '../../infrastructure/guards/topic-editable.guard';
import { CreateResourceUseCase } from '../../application/use-cases/resources/create-resource.use-case';
import { UpdateResourceUseCase } from '../../application/use-cases/resources/update-resource.use-case';
import { DeleteResourceUseCase } from '../../application/use-cases/resources/delete-resource.use-case';
import { UploadResourceUseCase } from '../../application/use-cases/resources/upload-resource.use-case';
import { CreateResourceDto } from '../dto/resources/create-resource.dto';
import { UpdateResourceDto } from '../dto/resources/update-resource.dto';
import { UploadResourceDto } from '../dto/resources/upload-resource.dto';
import { ResourceResponseDto } from '../dto/resources/resource-response.dto';

@ApiTags('Resources')
@ApiBearerAuth()
@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourceController {
  constructor(
    private readonly createResourceUseCase: CreateResourceUseCase,
    private readonly updateResourceUseCase: UpdateResourceUseCase,
    private readonly deleteResourceUseCase: DeleteResourceUseCase,
    private readonly uploadResourceUseCase: UploadResourceUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resource with URL' })
  @ApiResponse({
    status: 201,
    description: 'Resource created',
    type: ResourceResponseDto,
  })
  async create(
    @Body() createResourceDto: CreateResourceDto,
  ): Promise<ResourceResponseDto> {
    return this.createResourceUseCase.execute(createResourceDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a resource file' })
  @ApiBody({ type: UploadResourceDto })
  @ApiResponse({
    status: 201,
    description: 'Resource uploaded',
    type: ResourceResponseDto,
  })
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }), // 100MB
          new FileTypeValidator({
            fileType:
              /(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|mp4|mp3|wav|webm)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadResourceDto: UploadResourceDto,
  ): Promise<ResourceResponseDto> {
    return this.uploadResourceUseCase.execute(
      file,
      uploadResourceDto.topicId,
      uploadResourceDto.title,
      uploadResourceDto.description,
      uploadResourceDto.type,
      uploadResourceDto.order,
    );
  }

  @Put(':id')
  @UseGuards(TopicEditableGuard)
  @ApiOperation({ summary: 'Update a resource' })
  @ApiResponse({
    status: 200,
    description: 'Resource updated',
    type: ResourceResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<ResourceResponseDto> {
    return this.updateResourceUseCase.execute(id, updateResourceDto);
  }

  @Delete(':id')
  @UseGuards(TopicEditableGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a resource' })
  @ApiResponse({ status: 204, description: 'Resource deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteResourceUseCase.execute(id);
  }
}
