import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/postgresql';
import { Invitations } from './invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Logger } from '@nestjs/common/services/logger.service';

@Injectable()
export class InvitationRepository extends AbstractRepository<Invitations> {
  protected readonly logger = new Logger(InvitationRepository.name);

  constructor(
    @InjectRepository(Invitations)
    invitationRepository: Repository<Invitations>,
    entityManager: EntityManager,
  ) {
    super(invitationRepository, entityManager);
  }
}
