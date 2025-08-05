import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserOrganizationRepository } from './models/user-organization.repository';
import {
  AddUserToOrganizationDto,
  UpdateUserRoleDto,
} from 'src/organization/dto/user-organization.dto';
import { Users } from 'src/users/models/users.entity';
import { OrganizationService } from 'src/organization/organization.service';
import { UserOrganizations } from './models/user-organization.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UserOrganizationService {
  constructor(
    private readonly userOrganizationRepository: UserOrganizationRepository,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RolesService,
  ) {}

  async addUserToOrganization(
    organizationId: string,
    addUserDto: AddUserToOrganizationDto,
  ) {
    const organization =
      await this.organizationService.findOrganizationById(organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if user is already in organization
    const existingUserOrganization =
      await this.userOrganizationRepository.findOne({
        where: { userId: addUserDto.userId, organizationId },
      });

    if (existingUserOrganization) {
      throw new BadRequestException('User is already in this organization');
    }

    const userOrganizationData = {
      userId: addUserDto.userId,
      organizationId,
      roleId: addUserDto.roleId,
    };

    const newUserOrganization = new UserOrganizations(userOrganizationData);
    Object.assign(newUserOrganization, userOrganizationData);
    return await this.userOrganizationRepository.create(newUserOrganization);
  }

  async inviteUserToOrganization(
    organizationId: string,
    addUserDto: AddUserToOrganizationDto,
    currentUser: Users,
  ) {
    const organization =
      await this.organizationService.findOrganizationById(organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if user has permission to invite users
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId: currentUser.id, organizationId },
      relations: ['role'],
    });

    if (!userOrganization?.role?.permissions?.manageUsers) {
      throw new ForbiddenException(
        'You do not have permission to invite users to this organization',
      );
    }

    // Check if user is already in organization
    const existingUserOrganization =
      await this.userOrganizationRepository.findOne({
        where: { userId: addUserDto.userId, organizationId },
      });

    if (existingUserOrganization) {
      throw new BadRequestException('User is already in this organization');
    }

    const userOrganizationData = {
      userId: addUserDto.userId,
      organizationId,
      roleId: addUserDto.roleId,
    };

    const newUserOrganization = new UserOrganizations(userOrganizationData);
    Object.assign(newUserOrganization, userOrganizationData);
    return await this.userOrganizationRepository.create(newUserOrganization);
  }

  async getUserOrganizations(userId: string) {
    const userOrganizations = await this.userOrganizationRepository.find({
      where: { userId },
      relations: ['organization', 'role'],
    });
    return userOrganizations;
  }

  async updateUserRole(
    organizationId: string,
    userId: string,
    updateRoleDto: UpdateUserRoleDto,
    currentUser: Users,
  ) {
    // Check if user has permission to update roles
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId: currentUser.id, organizationId },
      relations: ['role'],
    });

    if (!userOrganization?.role?.permissions?.manageUsers) {
      throw new ForbiddenException(
        'You do not have permission to update user roles in this organization',
      );
    }

    // Check if target user is in organization
    const targetUserOrganization =
      await this.userOrganizationRepository.findOne({
        where: { userId, organizationId },
      });

    if (!targetUserOrganization) {
      throw new NotFoundException('User is not in this organization');
    }

    // Check if role exists and belongs to this organization
    const role = await this.roleService.findRole(
      updateRoleDto.roleId,
      organizationId,
    );

    if (!role) {
      throw new NotFoundException('Role not found in this organization');
    }

    targetUserOrganization.roleId = updateRoleDto.roleId;
    return await this.userOrganizationRepository.create(targetUserOrganization);
  }

  async removeUserFromOrganization(
    organizationId: string,
    userId: string,
    currentUser: Users,
  ) {
    const organization =
      await this.organizationService.findOrganizationById(organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if target user is in organization
    const targetUserOrganization =
      await this.userOrganizationRepository.findOne({
        where: { userId, organizationId },
      });

    if (!targetUserOrganization) {
      throw new NotFoundException('User is not in this organization');
    }

    return await this.userOrganizationRepository.delete({
      id: targetUserOrganization.id,
    });
  }
}
