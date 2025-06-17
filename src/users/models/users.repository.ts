import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { EntityManager, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/postgresql';

@Injectable()
export class UsersRepository extends AbstractRepository<Users> {
  protected readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(Users)
    usersRepository: Repository<Users>,
    entityManager: EntityManager,
  ) {
    super(usersRepository, entityManager);
  }
}
