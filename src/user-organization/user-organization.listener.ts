import { Injectable } from '@nestjs/common';
import { UserOrganizationService } from './user-organization.service';
import { OrganizationService } from '../organization/organization.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Organizations } from '../organization/models/organization.entity';
import { Users } from '../users/models/users.entity';
import { Roles } from '../roles/entities/role.entity';
import { CREATE_ORGANIZATION_EVENT } from '@app/common/constants';

@Injectable()
export class UserOrganizationListener {
  constructor(
    private readonly userOrganizationService: UserOrganizationService,
    private readonly organizationService: OrganizationService,
  ) {}

  @OnEvent(CREATE_ORGANIZATION_EVENT)
  async handleOrganizationCreatedEvent(event: {
    organization: Organizations;
    user: Users;
    createdRole: Roles;
  }) {
    const { organization, user, createdRole } = event;

    // Automatically add the creator as the first user in the organization
    await this.userOrganizationService.addUserToOrganization(
      organization.id,
      { userId: user.id, roleId: createdRole.id },
      user,
    );
  }
}
