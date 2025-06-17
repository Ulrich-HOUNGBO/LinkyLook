import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthFields1686580000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "googleId" character varying,
      ADD COLUMN IF NOT EXISTS "refreshToken" character varying
    `);

    // Make password nullable for Google OAuth users
    await queryRunner.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "password" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Users" 
      DROP COLUMN IF EXISTS "googleId",
      DROP COLUMN IF EXISTS "refreshToken"
    `);

    // Make password required again
    await queryRunner.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "password" SET NOT NULL
    `);
  }
}
