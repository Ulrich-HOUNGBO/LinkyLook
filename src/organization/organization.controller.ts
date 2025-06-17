import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationDto } from './dto/organization.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Users } from '../users/models/users.entity';
import { RoleDto } from './dto/role.dto';
import { AddUserToOrganizationDto, UpdateUserRoleDto } from './dto/user-organization.dto';

@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async createOrganization(
    @Body() organizationDto: OrganizationDto,
    @ActiveUser() currentUser: Users
  ) {
    return this.organizationService.createOrganization(organizationDto, currentUser);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Find organization by slug' })
  async findOrganizationBySlug(@Param('slug') slug: string) {
    return this.organizationService.findOrganizationBySlug(slug);
  }

  @Put(':slug')
  @ApiOperation({ summary: 'Update organization' })
  async updateOrganization(
    @Param('slug') slug: string,
    @Body() updateData: Partial<{ name: string; description: string }>,
    @ActiveUser() currentUser: Users
  ) {
    return this.organizationService.updateOrganization(slug, updateData, currentUser);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete organization' })
  async deleteOrganization(
    @Param('slug') slug: string,
    @ActiveUser() currentUser: Users
  ) {
    return this.organizationService.deleteOrganization(slug, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  async listOrganizations() {
    return this.organizationService.listOrganizations();
  }

  @Get('user/organizations')
  @ApiOperation({ summary: 'Get organizations for current user' })
  async getUserOrganizations(@ActiveUser() currentUser: Users) {
    return this.organizationService.getUserOrganizations(currentUser.id);
  }

  @Post(':id/roles')
  @ApiOperation({ summary: 'Create a new role in organization' })
  async createRole(
    @Param('id') organizationId: string,
    @Body() roleDto: RoleDto,
    @ActiveUser() currentUser: Users
  ) {
    return this.organizationService.createRole(organizationId, roleDto, currentUser);
  }

  @Get(':id/roles')
  @ApiOperation({ summary: 'Get all roles in organization' })
  async getRoles(@Param('id') organizationId: string) {
    return this.organizationService.getRoles(organizationId);
  }

  @Post(':id/users')
  @ApiOperation({ summary: 'Add user to organization' })
  async addUserToOrganization(
    @Param('id') organizationId: string,
    @Body() addUserDto: AddUserToOrganizationDto,
    @ActiveUser() currentUser: Users
  ) {
    return this.organizationService.addUserToOrganization(organizationId, addUserDto, currentUser);
  }

  @Put(':id/users/:userId/role')
  @ApiOperation({ summary: 'Update user role in organization' })
  async updateUserRole(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
    @ActiveUser() currentUser: Users
  ) {
    return this.organizationService.updateUserRole(organizationId, userId, updateRoleDto, currentUser);
  }

  @Delete(':id/users/:userId')
  @ApiOperation({ summary: 'Remove user from organization' })
  async removeUserFromOrganization(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
    @ActiveUser() currentUser: Users
  ) {
    return this.organizationService.removeUserFromOrganization(organizationId, userId, currentUser);
  }
}
