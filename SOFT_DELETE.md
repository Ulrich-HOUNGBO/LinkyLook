# Soft Delete Support in Linklysts

This document explains how soft delete functionality is implemented in the Linklysts project.

## What is Soft Delete?

Soft delete is a pattern where records are marked as "deleted" in the database but are not actually removed. This allows for data recovery and maintains referential integrity while still allowing users to "delete" records.

## Implementation

### Entity Structure

All entities in the system extend the `AbstractEntity` class, which includes the following fields for soft delete support:

```typescript
@Column({ type: 'boolean', default: false })
deleted: boolean;

@DeleteDateColumn()
deletedAt?: Date;
```

- `deleted`: A boolean flag indicating whether the entity has been soft-deleted
- `deletedAt`: A timestamp indicating when the entity was soft-deleted

### Global Configuration

Soft delete is enabled globally in the TypeORM configuration:

```typescript
// In mongo-database.module.ts and typeorm.config.ts
{
  // ...other configuration
  softDelete: true,
}
```

This ensures that soft-deleted entities are automatically filtered out in all queries, including relationship queries.

### Repository Methods

The `AbstractRepository` class provides methods for working with soft-deleted entities:

#### Soft Delete Operation

```typescript
async softDelete(
  where: FindOptionsWhere<T>,
  message?: string | null,
): Promise<string> {
  await this.entityRepository.softDelete(where);
  await this.entityRepository.update(where, {
    deleted: true,
  } as unknown as QueryDeepPartialEntity<T>);
  return message ?? message;
}
```

#### Restore Operation

```typescript
async restore(
  where: FindOptionsWhere<T>,
  message?: string | null,
): Promise<string | null | undefined> {
  await this.entityRepository.restore(where);
  await this.entityRepository.update(where, {
    deleted: false,
  } as unknown as QueryDeepPartialEntity<T>);
  return message ?? message;
}
```

### Query Methods

All query methods in the `AbstractRepository` class respect the soft-delete flag:

```typescript
// Find multiple entities
async find(options: FindManyOptions<T>): Promise<T[]> {
  const withSoftDeleteFilter = {
    ...options,
    withDeleted: options.withDeleted ?? false,
  };
  return this.entityRepository.find(withSoftDeleteFilter);
}

// Find one entity
async findOne(options: FindOneOptions<T>): Promise<T> {
  const withSoftDeleteFilter = {
    ...options,
    withDeleted: options.withDeleted ?? false,
  };
  return await this.entityRepository.findOne(withSoftDeleteFilter);
}

// Find one entity with relations
async findOneWithRelation(
  where: FindOptionsWhere<T>,
  relation: FindOptionsRelations<T>,
  withDeleted: boolean = false,
): Promise<T> {
  return await this.entityRepository.findOne({ 
    where, 
    relations: relation,
    withDeleted: withDeleted,
  });
}

// Find entities by parameters
async findByParam(
  where: FindOptionsWhere<T>,
  withDeleted: boolean = false,
): Promise<T[]> {
  const entities = await this.entityRepository.find({ 
    where,
    withDeleted: withDeleted,
  });
  
  if (!entities || entities.length == 0) {
    this.logger.warn(`Entity not found with ${JSON.stringify(where)}`);
    throw new NotFoundException('Entity not found');
  }
  return entities;
}

// Update an entity
async update(
  where: FindOptionsWhere<T>,
  partialEntity: QueryDeepPartialEntity<T>,
  withDeleted: boolean = false,
): Promise<T> {
  await this.entityRepository.update(where, partialEntity);

  return this.findOne({ 
    where,
    withDeleted: withDeleted,
  });
}
```

## Usage

### Default Behavior

By default, all queries will exclude soft-deleted entities:

```typescript
// This will only return non-deleted entities
const users = await userRepository.find({});
```

### Including Soft-Deleted Entities

To include soft-deleted entities in your queries, set the `withDeleted` option to `true`:

```typescript
// This will return all entities, including soft-deleted ones
const allUsers = await userRepository.find({ withDeleted: true });
```

Or use the optional parameter in the repository methods:

```typescript
// This will return the entity even if it's soft-deleted
const user = await userRepository.findOneWithRelation({ id: '123' }, { profile: true }, true);
```

### Relationships

The global soft-delete configuration ensures that soft-deleted entities are not returned in relationship queries. For example, if a User has many Posts and some Posts are soft-deleted, those soft-deleted Posts will not be included when loading the User's Posts.