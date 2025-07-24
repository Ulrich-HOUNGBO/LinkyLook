import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/postgresql';
import { UserOrganizations } from './user-organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserOrganizationRepository extends AbstractRepository<UserOrganizations> {
  protected readonly logger = new Logger(UserOrganizationRepository.name);

  constructor(
    @InjectRepository(UserOrganizations)
    userOrganizationRepository: Repository<UserOrganizations>,
    entityManager: EntityManager,
  ) {
    super(userOrganizationRepository, entityManager);
  }
}
