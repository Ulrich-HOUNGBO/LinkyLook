import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { DatabaseModule } from '@app/common/database/postgresql';
import { Organizations } from './models/organization.entity';
import { OrganizationRepository } from './models/organization.repository';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { UserOrganizations } from '../user-organization/models/user-organization.entity';
import { Roles } from '../roles/entities/role.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Organizations, Roles, UserOrganizations]),
    UsersModule,
    RolesModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
  exports: [OrganizationService],
})
export class OrganizationModule {}
