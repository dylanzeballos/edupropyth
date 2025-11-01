import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ResourceType } from '../enums/resource-type.enum';
import { Topic } from './topic.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'topic_id' })
  topicId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ResourceType,
  })
  type: ResourceType;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'public_id' })
  publicId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => Topic, (topic) => topic.resources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic?: Topic;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
