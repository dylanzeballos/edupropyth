import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEdition } from './course-edition.entity';
import { User } from '../../auth/domain/entities/user.entity';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  DROPPED = 'dropped',
  COMPLETED = 'completed',
}

@Entity('enrollments')
@Unique(['editionId', 'studentId'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CourseEdition, (edition) => edition.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'edition_id' })
  edition?: CourseEdition;

  @Column({ name: 'edition_id', type: 'uuid' })
  editionId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'student_id' })
  student?: User;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'assigned_instructor_id' })
  assignedInstructor?: User | null;

  @Column({ name: 'assigned_instructor_id', type: 'uuid', nullable: true })
  assignedInstructorId: string | null = null;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @Column({
    type: 'timestamptz',
    name: 'enrolled_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  enrolledAt: Date;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt: Date | null = null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
