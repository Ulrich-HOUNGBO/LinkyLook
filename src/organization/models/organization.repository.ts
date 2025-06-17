import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/postgresql';
import { Organizations } from './organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrganizationRepository extends AbstractRepository<Organizations> {
  protected readonly logger = new Logger(OrganizationRepository.name);

  constructor(
    @InjectRepository(Organizations)
    organizationRepository: Repository<Organizations>,
    entityManager: EntityManager,
  ) {
    super(organizationRepository, entityManager);
  }
}
