import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRefreshTokenField1686580000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Users" 
      DROP COLUMN IF EXISTS "refreshToken"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "refreshToken" character varying
    `);
  }
}