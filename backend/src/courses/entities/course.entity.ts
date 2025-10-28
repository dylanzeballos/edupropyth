import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEdition } from './course-edition.entity';

@Entity('courses')
@Unique(['code'])
@Unique(['slug'])
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  slug: string | null = null;

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CourseEdition, (edition) => edition.course)
  editions?: CourseEdition[];
}
