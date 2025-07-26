import { Module } from '@nestjs/common';
import { UserOrganizationService } from './user-organization.service';
import { UserOrganizationController } from './user-organization.controller';
import { UserOrganizationListener } from './user-organization.listener';
import { UserOrganizationRepository } from './models/user-organization.repository';
import { UserOrganizations } from './models/user-organization.entity';
import { DatabaseModule } from '@app/common';
import { RolesModule } from '../roles/roles.module';
import { Roles } from '../roles/entities/role.entity';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([UserOrganizations, Roles]),
    RolesModule,
    OrganizationModule,
  ],
  controllers: [UserOrganizationController],
  providers: [
    UserOrganizationService,
    UserOrganizationRepository,
    UserOrganizationListener,
  ],
  exports: [UserOrganizationService],
})
export class UserOrganizationModule {}
