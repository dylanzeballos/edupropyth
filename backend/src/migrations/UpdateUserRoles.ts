import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRoles1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Paso 1: Agregar columna temporal
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "role_temp" VARCHAR(50);
    `);

    // Paso 2: Copiar datos actuales
    await queryRunner.query(`
      UPDATE "users" SET "role_temp" = "role"::text;
    `);

    // Paso 3: Eliminar columna antigua
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "role";
    `);

    // Paso 4: Crear nuevo enum
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('admin', 'teacher_executor', 'teacher_editor', 'student');
    `);

    // Paso 5: Crear nueva columna con el enum
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "role" "user_role_enum" DEFAULT 'student';
    `);

    // Paso 6: Migrar datos (teacher -> teacher_executor por defecto)
    await queryRunner.query(`
      UPDATE "users"
      SET "role" = CASE
        WHEN "role_temp" = 'admin' THEN 'admin'::user_role_enum
        WHEN "role_temp" = 'teacher' THEN 'teacher_executor'::user_role_enum
        ELSE 'student'::user_role_enum
      END;
    `);

    // Paso 7: Eliminar columna temporal
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "role_temp";
    `);

    // Paso 8: Hacer la columna NOT NULL
    await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Paso 1: Agregar columna temporal
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "role_temp" VARCHAR(50);
    `);

    // Paso 2: Copiar y convertir datos
    await queryRunner.query(`
      UPDATE "users"
      SET "role_temp" = CASE
        WHEN "role"::text = 'admin' THEN 'admin'
        WHEN "role"::text IN ('teacher_executor', 'teacher_editor') THEN 'teacher'
        ELSE 'student'
      END;
    `);

    // Paso 3: Eliminar columna actual
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "role";
    `);

    // Paso 4: Eliminar enum actual
    await queryRunner.query(`
      DROP TYPE "user_role_enum";
    `);

    // Paso 5: Crear enum antiguo
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('admin', 'teacher', 'student');
    `);

    // Paso 6: Recrear columna con enum antiguo
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "role" "user_role_enum" DEFAULT 'student';
    `);

    // Paso 7: Restaurar datos
    await queryRunner.query(`
      UPDATE "users"
      SET "role" = "role_temp"::user_role_enum;
    `);

    // Paso 8: Eliminar columna temporal
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "role_temp";
    `);

    // Paso 9: Hacer la columna NOT NULL
    await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
    `);
  }
}
