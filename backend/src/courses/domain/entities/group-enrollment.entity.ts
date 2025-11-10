import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from '../../../auth/domain/entities/user.entity';
import { EnrollmentStatus } from '../enums/enrollment-status.enum';

@Entity('group_enrollments')
export class GroupEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'group_id' })
  groupId: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({
    name: 'enrolled_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  enrolledAt: Date;

  @Column({ name: 'enrolled_by', nullable: true })
  enrolledBy?: string;

  @ManyToOne(() => Group, (group) => group.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group?: Group;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
