import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../../../domain/entities/group.entity';

export class GroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  schedule?: string;

  @ApiProperty({ required: false })
  instructorId?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false })
  enrollmentKey?: string;

  @ApiProperty({ required: false })
  maxStudents?: number;

  @ApiProperty({ required: false })
  enrollmentStartDate?: Date;

  @ApiProperty({ required: false })
  enrollmentEndDate?: Date;

  @ApiProperty()
  isEnrollmentOpen: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [String] })
  studentIds: string[];

  constructor(group: Group) {
    this.id = group.id;
    this.courseId = group.courseId;
    this.name = group.name;
    this.schedule = group.schedule;
    this.instructorId = group.instructorId;
    this.isActive = group.isActive;
    this.enrollmentKey = group.enrollmentKey;
    this.maxStudents = group.maxStudents;
    this.enrollmentStartDate = group.enrollmentStartDate;
    this.enrollmentEndDate = group.enrollmentEndDate;
    this.isEnrollmentOpen = group.isEnrollmentOpen;
    this.createdAt = group.createdAt;
    this.updatedAt = group.updatedAt;
    this.studentIds = group.enrollments?.map((enr) => enr.userId) ?? [];
  }

  static fromGroup(group: Group): GroupResponseDto {
    return new GroupResponseDto(group);
  }

  static fromGroups(groups: Group[]): GroupResponseDto[] {
    return groups.map((group) => GroupResponseDto.fromGroup(group));
  }
}
