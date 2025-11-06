import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';

export interface ContentBlock {
  id: string;
  type: string;
  layout: string;
  order: number;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  content: {
    html?: string;
    videoUrl?: string;
    resourceIds?: string[];
    activityIds?: string[];
    documentUrl?: string;
    title?: string;
    description?: string;
  };
  style?: {
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
  };
}

@Entity('course_templates')
export class CourseTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'course_id', unique: true })
  courseId: string;

  @Column({ type: 'jsonb', default: [] })
  blocks: ContentBlock[];

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy?: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course?: Course;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
