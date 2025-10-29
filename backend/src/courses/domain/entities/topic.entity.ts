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

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  duration: number; // duración en minutos

  @Column({ type: 'varchar', length: 50, default: 'theory' })
  type: string; // theory, practice, exercise, quiz

  @Column({ name: 'course_id' })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<Topic> = {}) {
    Object.assign(this, partial);
  }
}
