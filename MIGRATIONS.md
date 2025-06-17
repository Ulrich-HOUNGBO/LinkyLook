# Database Migrations Guide

This guide explains how to use TypeORM migrations in the Linklysts project.

## What are Migrations?

Migrations are a way to incrementally update your database schema and keep it in sync with your application's data models while preserving existing data. Instead of using `synchronize: true` (which can lead to data loss in production), migrations provide a safe way to make schema changes.

## Migration Files

Migration files are stored in the `migrations` directory at the root of the project. Each migration file contains two methods:

- `up`: Contains the transformations to be applied to the database (create table, add column, etc.)
- `down`: Contains the transformations to revert the changes made in the `up` method (drop table, remove column, etc.)

## Migration Commands

The following npm scripts are available for working with migrations:

### Generate a Migration

To generate a migration based on entity changes:

```bash
npm run migration:generate -- migrations/MigrationName
```

This compares your current entity definitions with the database schema and generates the necessary SQL statements to update the database.

### Create an Empty Migration

To create an empty migration file:

```bash
npm run migration:create -- migrations/MigrationName
```

Use this when you need to write custom SQL statements or perform complex operations.

### Run Migrations

To run all pending migrations:

```bash
npm run migration:run
```

This applies all migrations that haven't been applied yet.

### Revert Migrations

To revert the most recently applied migration:

```bash
npm run migration:revert
```

## Best Practices

1. **Never use `synchronize: true` in production**. The database module is configured to disable synchronize in production environments.

2. **Always test migrations**. Before applying migrations to production, test them in a development or staging environment.

3. **Keep migrations small and focused**. Each migration should make a small, specific change to the database schema.

4. **Include both `up` and `down` methods**. This allows you to roll back changes if needed.

5. **Use TypeORM's query builder** for complex queries to ensure database compatibility.

## Example Migration

Here's an example of a migration that creates a users table:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1686580000000 implements MigrationInterface {
  name = 'CreateUsersTable1686580000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "deleted" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "username" character varying(50) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
```

## Environment Configuration

Make sure your environment variables are properly set up for database connections:

- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `NODE_ENV`: Environment (development, production, etc.)