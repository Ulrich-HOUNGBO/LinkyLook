import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from './models/organization.repository';
import { OrganizationDto } from './dto/organization.dto';
import { Organizations } from './models/organization.entity';
import { Users } from '../users/models/users.entity';
import { RolesService } from '../roles/roles.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createSlug } from '@app/common/utils';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly roleService: RolesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createOrganization(
    organizationDto: OrganizationDto,
    currentUser: Users,
  ) {
    const organization = new Organizations(organizationDto);
    organization.slug = createSlug(organizationDto.name);
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
    const ownerRole = {
      name: 'Owner',
      description: 'Organization owner with full access',
      permissions: {
        manageOrganization: true,
        manageUsers: true,
        manageRoles: true,
      },
      organization: createdOrganization,
    };

    const createdRole = await this.roleService.createRole(ownerRole);

    await this.eventEmitter.emitAsync('organization.created', {
      organization: createdOrganization,
      user: currentUser,
      createdRole,
    });

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
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { slug },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    Object.assign(organization, updateData);
    return await this.organizationRepository.create(organization);
  }

  async deleteOrganization(slug: string) {
    const organization = await this.organizationRepository.findOne({
      where: { slug },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return await this.organizationRepository.softDelete({
      id: organization.id,
    });
  }

  async listOrganizations() {
    return await this.organizationRepository.find({});
  }

  async findOrganizationById(id: string) {
    return await this.organizationRepository.findOne({ where: { id } });
  }
}
