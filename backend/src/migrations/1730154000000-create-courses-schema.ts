import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateCoursesSchema1730154000000 implements MigrationInterface {
  name = 'CreateCoursesSchema1730154000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: 'courses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '50',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '160',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `CREATE TYPE "course_editions_status_enum" AS ENUM ('draft','ongoing','finished','archived')`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'course_editions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'course_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'label',
            type: 'varchar',
            length: '80',
            isNullable: false,
          },
          {
            name: 'term',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'course_editions_status_enum',
            default: `'draft'`,
          },
          {
            name: 'archived_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'archived_by_user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
        ],
        uniques: [
          {
            name: 'UQ_course_editions_course_label',
            columnNames: ['course_id', 'label'],
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'course_editions',
      new TableForeignKey({
        columnNames: ['course_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'courses',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'course_editions',
      new TableForeignKey({
        columnNames: ['archived_by_user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.query(
      `CREATE TYPE "edition_instructors_role_enum" AS ENUM ('instructor','encargado')`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'edition_instructors',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'edition_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'instructor_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'edition_instructors_role_enum',
            default: `'instructor'`,
          },
          {
            name: 'assigned_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'unassigned_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
        ],
        uniques: [
          {
            name: 'UQ_edition_instructors_unique_assignment',
            columnNames: ['edition_id', 'instructor_id', 'role'],
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('edition_instructors', [
      new TableForeignKey({
        columnNames: ['edition_id'],
        referencedTableName: 'course_editions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['instructor_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);

    await queryRunner.query(
      `CREATE TYPE "enrollments_status_enum" AS ENUM ('active','dropped','completed')`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'enrollments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'edition_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'student_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'assigned_instructor_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enrollments_status_enum',
            default: `'active'`,
          },
          {
            name: 'enrolled_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'completed_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
        ],
        uniques: [
          {
            name: 'UQ_enrollments_edition_student',
            columnNames: ['edition_id', 'student_id'],
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('enrollments', [
      new TableForeignKey({
        columnNames: ['edition_id'],
        referencedTableName: 'course_editions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['student_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['assigned_instructor_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    ]);

    await queryRunner.createIndex(
      'enrollments',
      new TableIndex({
        name: 'IDX_enrollments_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('enrollments', 'IDX_enrollments_status');
    await queryRunner.dropTable('enrollments');
    await queryRunner.query(`DROP TYPE "enrollments_status_enum"`);

    await queryRunner.dropTable('edition_instructors');
    await queryRunner.query(`DROP TYPE "edition_instructors_role_enum"`);

    await queryRunner.dropTable('course_editions');
    await queryRunner.query(`DROP TYPE "course_editions_status_enum"`);

    await queryRunner.dropTable('courses');
  }
}
