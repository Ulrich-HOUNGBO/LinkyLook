import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '@app/common/database/postgresql';
import { Campaigns } from './campaign.entity';

@Injectable()
export class CampaignRepository extends AbstractRepository<Campaigns> {
  protected readonly logger = new Logger(CampaignRepository.name);

  constructor(
    @InjectRepository(Campaigns)
    private readonly campaignRepository: Repository<Campaigns>,
    entityManager: EntityManager,
  ) {
    super(campaignRepository, entityManager);
  }
}
