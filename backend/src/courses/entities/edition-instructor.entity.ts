import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEdition } from './course-edition.entity';
import { User } from '../../auth/domain/entities/user.entity';

export enum EditionInstructorRole {
  INSTRUCTOR = 'instructor',
  ENCARGADO = 'encargado',
}

@Entity('edition_instructors')
@Unique(['editionId', 'instructorId', 'role'])
export class EditionInstructor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CourseEdition, (edition) => edition.instructors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'edition_id' })
  edition?: CourseEdition;

  @Column({ name: 'edition_id', type: 'uuid' })
  editionId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'instructor_id' })
  instructor?: User;

  @Column({ name: 'instructor_id', type: 'uuid' })
  instructorId: string;

  @Column({
    type: 'enum',
    enum: EditionInstructorRole,
    default: EditionInstructorRole.INSTRUCTOR,
  })
  role: EditionInstructorRole;

  @Column({
    type: 'timestamptz',
    name: 'assigned_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assignedAt: Date;

  @Column({ type: 'timestamptz', name: 'unassigned_at', nullable: true })
  unassignedAt: Date | null = null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
