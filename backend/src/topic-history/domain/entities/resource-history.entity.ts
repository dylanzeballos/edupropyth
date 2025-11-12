import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../auth/domain/entities/user.entity';
import { TopicHistory } from './topic-history.entity';
import { HistoryAction } from '../enums/history-action.enum';

@Entity('resource_history')
export class ResourceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'resource_id' })
  resourceId: string;

  @Column({ name: 'topic_id' })
  topicId: string;

  @Column({ name: 'topic_history_id' })
  topicHistoryId: string;

  @ManyToOne(
    () => TopicHistory,
    (topicHistory) => topicHistory.resourceHistories,
  )
  @JoinColumn({ name: 'topic_history_id' })
  topicHistory: TopicHistory;

  @Column()
  version: number;

  @Column({
    type: 'enum',
    enum: HistoryAction,
  })
  action: HistoryAction;

  @Column('jsonb', { nullable: true })
  changes: Record<string, any>;

  @Column('jsonb', { nullable: true })
  previousData: Record<string, any>;

  @Column('jsonb')
  currentData: Record<string, any>;

  @Column({ name: 'edited_by_id' })
  editedById: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'edited_by_id' })
  editedBy: User;

  @CreateDateColumn({ name: 'edited_at' })
  editedAt: Date;
}
