import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from './models/organization.repository';
import { OrganizationDto } from './dto/organization.dto';
import { Organizations } from './models/organization.entity';
import { RoleRepository } from './models/role.repository';
import { UserOrganizationRepository } from './models/user-organization.repository';
import { Roles } from './models/role.entity';
import { UserOrganizations } from './models/user-organization.entity';
import { RoleDto } from './dto/role.dto';
import {
  AddUserToOrganizationDto,
  UpdateUserRoleDto,
} from './dto/user-organization.dto';
import { Users } from '../users/models/users.entity';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userOrganizationRepository: UserOrganizationRepository,
  ) {}

  async createOrganization(
    organizationDto: OrganizationDto,
    currentUser: Users,
  ) {
    const organization = new Organizations(organizationDto);
    organization.slug = organizationDto.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const existingOrganization = await this.organizationRepository.findOne({
      where: { name: organization.name },
    });
    if (existingOrganization) {
      throw new BadRequestException(
        'Organization with this name already exists',
      );
    }
    Object.assign(organization, organizationDto);
    const createdOrganization =
      await this.organizationRepository.create(organization);

    // Create default owner role
    const ownerRole = new Roles({
      name: 'Owner',
      description: 'Organization owner with full access',
      permissions: {
        manageOrganization: true,
        manageUsers: true,
        manageRoles: true,
      },
      organizationId: createdOrganization.id,
    });
    const createdRole = await this.roleRepository.create(ownerRole);

    // Add current user to organization with owner role
    const userOrganization = new UserOrganizations({
      userId: currentUser.id,
      organizationId: createdOrganization.id,
      roleId: createdRole.id,
    });
    await this.userOrganizationRepository.create(userOrganization);

    return createdOrganization;
  }

  async findOrganizationBySlug(slug: string) {
    const organization = await this.organizationRepository.findOne({
      where: { slug },
      relations: [
        'userOrganizations',
        'userOrganizations.user',
        'userOrganizations.role',
        'roles',
      ],
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async updateOrganization(
    slug: string,
    updateData: Partial<{ name: string; description: string }>,
    currentUser: Users,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { slug },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if user has permission to update organization
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId: currentUser.id, organizationId: organization.id },
      relations: ['role'],
    });

    if (
      !userOrganization ||
      !userOrganization.role?.permissions?.manageOrganization
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this organization',
      );
    }

    Object.assign(organization, updateData);
    return await this.organizationRepository.create(organization);
  }

  async deleteOrganization(slug: string, currentUser: Users) {
    const organization = await this.organizationRepository.findOne({
      where: { slug },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if user has permission to delete organization
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId: currentUser.id, organizationId: organization.id },
      relations: ['role'],
    });

    if (
      !userOrganization ||
      !userOrganization.role?.permissions?.manageOrganization
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this organization',
      );
    }

    return await this.organizationRepository.softDelete(organization);
  }

  async listOrganizations() {
    return await this.organizationRepository.find({});
  }

  async findOrganizationById(id: string) {
    return await this.organizationRepository.findOne({ where: { id } });
  }

  async getUserOrganizations(userId: string) {
    const userOrganizations = await this.userOrganizationRepository.find({
      where: { userId },
      relations: ['organization', 'role'],
    });

    return userOrganizations;
  }

  async createRole(
    organizationId: string,
    roleDto: RoleDto,
    currentUser: Users,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if user has permission to create roles
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId: currentUser.id, organizationId },
      relations: ['role'],
    });

    if (!userOrganization || !userOrganization.role?.permissions?.manageRoles) {
      throw new ForbiddenException(
        'You do not have permission to create roles in this organization',
      );
    }

    const role = new Roles({
      ...roleDto,
      organizationId,
    });

    return await this.roleRepository.create(role);
  }

  async getRoles(organizationId: string) {
    return await this.roleRepository.find({
      where: { organizationId },
    });
  }

  async addUserToOrganization(
    organizationId: string,
    addUserDto: AddUserToOrganizationDto,
    currentUser: Users,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if user has permission to add users
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId: currentUser.id, organizationId },
      relations: ['role'],
    });

    if (!userOrganization || !userOrganization.role?.permissions?.manageUsers) {
      throw new ForbiddenException(
        'You do not have permission to add users to this organization',
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

    const newUserOrganization = new UserOrganizations({
      userId: addUserDto.userId,
      organizationId,
      roleId: addUserDto.roleId,
    });

    return await this.userOrganizationRepository.create(newUserOrganization);
  }

  async updateUserRole(
    organizationId: string,
    userId: string,
    updateRoleDto: UpdateUserRoleDto,
    currentUser: Users,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if user has permission to update roles
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId: currentUser.id, organizationId },
      relations: ['role'],
    });

    if (!userOrganization || !userOrganization.role?.permissions?.manageUsers) {
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
    const role = await this.roleRepository.findOne({
      where: { id: updateRoleDto.roleId, organizationId },
    });

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
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if user has permission to remove users
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId: currentUser.id, organizationId },
      relations: ['role'],
    });

    if (!userOrganization || !userOrganization.role?.permissions?.manageUsers) {
      throw new ForbiddenException(
        'You do not have permission to remove users from this organization',
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

    return await this.userOrganizationRepository.delete(targetUserOrganization);
  }
}
