import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { EditionInstructor } from './edition-instructor.entity';
import { Enrollment } from './enrollment.entity';

export enum CourseEditionStatus {
  DRAFT = 'draft',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
  ARCHIVED = 'archived',
}

@Entity('course_editions')
@Unique(['courseId', 'label'])
export class CourseEdition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, (course) => course.editions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course?: Course;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ type: 'varchar', length: 80 })
  label: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  term: string | null = null;

  @Column({ type: 'int', nullable: true })
  year: number | null = null;

  @Column({ type: 'timestamptz', name: 'start_date', nullable: true })
  startDate: Date | null = null;

  @Column({ type: 'timestamptz', name: 'end_date', nullable: true })
  endDate: Date | null = null;

  @Column({
    type: 'enum',
    enum: CourseEditionStatus,
    default: CourseEditionStatus.DRAFT,
  })
  status: CourseEditionStatus;

  @Column({ type: 'timestamptz', name: 'archived_at', nullable: true })
  archivedAt: Date | null = null;

  @Column({ name: 'archived_by_user_id', type: 'uuid', nullable: true })
  archivedByUserId: string | null = null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => EditionInstructor,
    (editionInstructor) => editionInstructor.edition,
  )
  instructors?: EditionInstructor[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.edition)
  enrollments?: Enrollment[];
}
