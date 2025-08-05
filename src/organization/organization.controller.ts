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
import { OrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Users } from '../users/models/users.entity';

@ApiTags('Organization')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async createOrganization(
    @Body() organizationDto: OrganizationDto,
    @ActiveUser() currentUser: Users,
  ) {
    return this.organizationService.createOrganization(
      organizationDto,
      currentUser,
    );
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
    @Body() updateData: UpdateOrganizationDto,
  ) {
    return this.organizationService.updateOrganization(slug, updateData);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete organization' })
  async deleteOrganization(@Param('slug') slug: string) {
    return this.organizationService.deleteOrganization(slug);
  }

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  async listOrganizations() {
    return this.organizationService.listOrganizations();
  }
}
