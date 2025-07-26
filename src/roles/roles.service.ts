import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './entities/role.repository';
import { Roles } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Roles> {
    const role = new Roles(createRoleDto);
    Object.assign(role, createRoleDto);
    console.log('Creating role:', role);
    return this.roleRepository.create(role);
  }

  async findAllRoles(): Promise<Roles[]> {
    return this.roleRepository.find({});
  }

  async findOne(id: string): Promise<Roles> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error(`Role not found`);
    }
    return role;
  }

  async findRole(id: string, organizationId?: string): Promise<Roles> {
    const whereClause = organizationId
      ? { id, organization: { id: organizationId } }
      : { id };

    const role = await this.roleRepository.findOne({ where: whereClause });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }
}
