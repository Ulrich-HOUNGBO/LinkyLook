import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { DatabaseModule } from '@app/common/database/postgresql';
import { Organizations } from './models/organization.entity';
import { OrganizationRepository } from './models/organization.repository';
import { Roles } from './models/role.entity';
import { RoleRepository } from './models/role.repository';
import { UserOrganizations } from './models/user-organization.entity';
import { UserOrganizationRepository } from './models/user-organization.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Organizations, Roles, UserOrganizations]),
    UsersModule,
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationRepository,
    RoleRepository,
    UserOrganizationRepository,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
