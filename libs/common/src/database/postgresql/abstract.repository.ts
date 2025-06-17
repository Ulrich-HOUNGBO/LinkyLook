import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  protected constructor(
    private readonly entityRepository: Repository<T>,
    protected readonly entityManager: EntityManager,
  ) {}

  /**
   * Creates a new entity in the database.
   *
   * @param entity - The entity to be created.
   * @returns {Promise} - A promise that resolves to the created entity.
   */

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  /**
   * Finds entity in the database that matches the provided conditions.
   *
   * @returns {Promise<[]>} - A promise that resolves to an array of found entity.
   * @param options
   */

  async find(options: FindManyOptions<T>): Promise<T[]> {
    // Ensure we're not getting soft-deleted entities
    const withSoftDeleteFilter = {
      ...options,
      withDeleted: options.withDeleted ?? false,
    };
    return this.entityRepository.find(withSoftDeleteFilter);
  }

  /**
   * Finds a single entity in the database that matches the provided conditions.
   * Throws a NotFoundException if no entity is found.
   *
   * @returns {Promise} - A promise that resolves to the found entity.
   * @throws {NotFoundException} - If no entity is found.
   * @param options
   */

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    // Ensure we're not getting soft-deleted entities
    const withSoftDeleteFilter = {
      ...options,
      withDeleted: options.withDeleted ?? false,
    };
    return await this.entityRepository.findOne(withSoftDeleteFilter);
  }

  async findOneWithRelation(
    where: FindOptionsWhere<T>,
    relation: FindOptionsRelations<T>,
    withDeleted: boolean = false,
  ): Promise<T | null> {
    return await this.entityRepository.findOne({
      where,
      relations: relation,
      withDeleted: withDeleted,
    });
  }

  /**
   * Finds entity in the database that matches the provided conditions.
   * Throws a NotFoundException if no entity is found.
   *
   * @param {FindOptionsWhere} where - The conditions to match.
   * @param withDeleted
   * @returns {Promise} - A promise that resolves to the found entity.
   * @throws {NotFoundException} - If no entity is found.
   */

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

  /**
   * Updates an entity in the database that matches the provided conditions.
   * Throws a NotFoundException if no entity is found to update.
   *
   * @param {FindOptionsWhere} where - The conditions to match.
   * @param {QueryDeepPartialEntity} partialEntity - The new values for the entity.
   * @param withDeleted
   * @returns {Promise} - A promise that resolves to the updated entity.
   * @throws {NotFoundException} - If no entity is found to update.
   */

  async update(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
    withDeleted: boolean = false,
  ): Promise<T | null> {
    await this.entityRepository.update(where, partialEntity);

    return this.findOne({
      where,
      withDeleted: withDeleted,
    });
  }

  /**
   * Deletes an entity in the database that matches the provided conditions.
   *
   * @param {FindOptionsWhere} where - The conditions to match.
   * @param message
   * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
   */

  async delete(
    where: FindOptionsWhere<T>,
    message?: string | null,
  ): Promise<string | null | undefined> {
    await this.entityRepository.delete(where);
    return message ?? message;
  }

  /**
   * Soft-delete an entity in the database that matches the provided conditions
   * @param {FindOptionsWhere} where - The conditions to match.
   * @param message
   * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
   */

  async softDelete(
    where: FindOptionsWhere<T>,
    message?: string | null,
  ): Promise<string | null | undefined> {
    await this.entityRepository.softDelete(where);
    return message ?? message;
  }

  /**
   * Restore an entity in the database that matches the provided conditions
   * @param {FindOptionsWhere} where - The conditions to match.
   * @param message
   * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
   */

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
}
