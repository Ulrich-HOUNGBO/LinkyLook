import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database';
import { Links } from './links.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LinksRepository extends AbstractRepository<Links> {
  protected readonly logger = new Logger(LinksRepository.name);

  constructor(
    @InjectRepository(Links)
    private readonly linksRepository: Repository<Links>,
    entityManager: EntityManager,
  ) {
    super(linksRepository, entityManager);
  }
}
