import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/postgresql';
import { Roles } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends AbstractRepository<Roles> {
  protected readonly logger = new Logger(RoleRepository.name);

  constructor(
    @InjectRepository(Roles)
    roleRepository: Repository<Roles>,
    entityManager: EntityManager,
  ) {
    super(roleRepository, entityManager);
  }
}