import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../../auth/domain/entities/user.entity';
import { HistoryAction } from '../enums/history-action.enum';
import { ResourceHistory } from './resource-history.entity';
import { ActivityHistory } from './activity-history.entity';

@Entity('topic_history')
export class TopicHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'topic_id' })
  topicId: string;

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

  @OneToMany(
    () => ResourceHistory,
    (resourceHistory) => resourceHistory.topicHistory,
  )
  resourceHistories: ResourceHistory[];

  @OneToMany(
    () => ActivityHistory,
    (activityHistory) => activityHistory.topicHistory,
  )
  activityHistories: ActivityHistory[];

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'edited_at' })
  editedAt: Date;
}
