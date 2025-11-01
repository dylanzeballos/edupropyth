import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ActivityType } from '../enums/activity-type.enum';
import { Topic } from './topic.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'topic_id' })
  topicId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column({ type: 'jsonb' })
  content: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true, name: 'due_date' })
  dueDate?: Date;

  @Column({ type: 'int', nullable: true, name: 'max_score' })
  maxScore?: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: false, name: 'is_required' })
  isRequired: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => Topic, (topic) => topic.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic?: Topic;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
