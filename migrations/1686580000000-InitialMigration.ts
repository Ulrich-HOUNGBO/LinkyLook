import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1686580000000 implements MigrationInterface {
  name = 'InitialMigration1686580000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Example of creating a table
    // await queryRunner.query(`
    //   CREATE TABLE "users" (
    //     "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    //     "deleted" boolean NOT NULL DEFAULT false,
    //     "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    //     "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    //     "deletedAt" TIMESTAMP,
    //     "username" character varying(50) NOT NULL,
    //     "email" character varying(255) NOT NULL,
    //     "password_hash" character varying(255) NOT NULL,
    //     CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
    //     CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
    //     CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
    //   )
    // `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Example of dropping a table
    // await queryRunner.query(`DROP TABLE "users"`);
  }
}