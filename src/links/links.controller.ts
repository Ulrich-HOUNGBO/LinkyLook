import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/links.dto';
import { Links } from './models/links.entity';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Users } from '../users/models/users.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Links')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new link' })
  async createLink(
    @Body() createLinkDto: CreateLinkDto,
    @ActiveUser() currentUser: Users,
  ): Promise<Links> {
    return this.linksService.createLink(createLinkDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all links' })
  async findAll(): Promise<Links[]> {
    return this.linksService.findAll();
  }

  @Get('find-links')
  @ApiOperation({ summary: 'Get links' })
  @ApiParam({
    name: 'organizationId',
    required: false,
    description: 'Filter links by organization ID',
  })
  @ApiParam({
    name: 'campaignId',
    required: false,
    description: 'Filter links by campaign ID',
  })
  async findLinks(
    @Param('organizationId') organizationId?: string,
    @Param('campaignId') campaignId?: string,
  ): Promise<Links[]> {
    return this.linksService.findLinks(organizationId, campaignId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get link by ID' })
  async findById(@Param('id') id: string): Promise<Links | null> {
    return this.linksService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a link' })
  async updateLink(
    @Param('id') id: string,
    @Body() updateLinkDto: Partial<CreateLinkDto>,
  ): Promise<Links | null> {
    return this.linksService.updateLink(id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link' })
  async deleteLink(@Param('id') id: string): Promise<void> {
    return this.linksService.deleteLink(id);
  }
}
