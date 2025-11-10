import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { GroupEnrollment } from './group-enrollment.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'course_id' })
  courseId: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  schedule?: string;

  @Column({ type: 'uuid', name: 'instructor_id', nullable: true })
  instructorId?: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'enrollment_key', nullable: true })
  enrollmentKey?: string;

  @Column({ name: 'max_students', nullable: true })
  maxStudents?: number;

  @Column({ name: 'enrollment_start_date', nullable: true })
  enrollmentStartDate?: Date;

  @Column({ name: 'enrollment_end_date', nullable: true })
  enrollmentEndDate?: Date;

  @Column({ name: 'is_enrollment_open', default: true })
  isEnrollmentOpen: boolean;

  @ManyToOne(() => Course, (course) => course.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course?: Course;

  @OneToMany(() => GroupEnrollment, (enrollment) => enrollment.group, {
    cascade: true,
  })
  enrollments?: GroupEnrollment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
