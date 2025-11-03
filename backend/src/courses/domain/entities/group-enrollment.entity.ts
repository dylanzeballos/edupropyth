import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from '../../../auth/domain/entities/user.entity';

@Entity('group_enrollments')
export class GroupEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'group_id' })
  groupId: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'enrolled_at' })
  enrolledAt: Date;

  @ManyToOne(() => Group, (group) => group.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group?: Group;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
