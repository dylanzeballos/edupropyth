import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlueprintsAndGroups1700000000002 implements MigrationInterface {
  name = 'AddBlueprintsAndGroups1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "course_blueprints" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar(255) NOT NULL,
        "description" text,
        "thumbnail" varchar(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "groups" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "course_id" uuid NOT NULL,
        "name" varchar(50) NOT NULL,
        "instructor_id" uuid,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_groups_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "group_enrollments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "group_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "enrolled_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_group_enrollments_group" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_group_enrollments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "blueprint_id" uuid;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'fk_courses_blueprint'
        ) THEN
          ALTER TABLE "courses"
          ADD CONSTRAINT "fk_courses_blueprint"
          FOREIGN KEY ("blueprint_id") REFERENCES "course_blueprints"("id") ON DELETE SET NULL;
        END IF;
      END$$;
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_groups_course_id ON "groups"("course_id");`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_enrollments_group_id ON "group_enrollments"("group_id");`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON "group_enrollments"("user_id");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT IF EXISTS "fk_courses_blueprint";`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN IF EXISTS "blueprint_id";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "group_enrollments";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "groups";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "course_blueprints";`);
  }
}
