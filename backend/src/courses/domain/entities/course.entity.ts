import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CourseStatus } from '../enums/course-status.enum';
import { Topic } from './topic.entity';
import { CourseBlueprint } from './course-blueprint.entity';
import { Group } from './group.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail?: string;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({ type: 'uuid', name: 'instructor_id', nullable: true })
  instructorId?: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'cloned_from_id' })
  clonedFromId?: string;

  @Column({ type: 'uuid', nullable: true, name: 'blueprint_id' })
  blueprintId?: string;

  @ManyToOne(() => CourseBlueprint, (bp) => bp.courses, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'blueprint_id' })
  blueprint?: CourseBlueprint;

  @OneToMany(() => Topic, (topic) => topic.course, { cascade: true })
  topics?: Topic[];

  @OneToMany(() => Group, (group) => group.course)
  groups?: Group[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
