import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '@app/common/database/postgresql';
import { Modeles } from './modeles.entity';

@Injectable()
export class ModelesRepository extends AbstractRepository<Modeles> {
  protected readonly logger = new Logger(ModelesRepository.name);

  constructor(
    @InjectRepository(Modeles)
    private readonly modelesRepository: Repository<Modeles>,
    entityManager: EntityManager,
  ) {
    super(modelesRepository, entityManager);
  }
}
