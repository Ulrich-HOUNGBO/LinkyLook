import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Campaigns')
@ApiBearerAuth('JWT')
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new campaign',
    description: 'Creates a new campaign with the provided details.',
  })
  @ApiResponse({
    status: 201,
    description: 'Campaign created successfully.',
  })
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.create(createCampaignDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all campaigns',
    description: 'Retrieves a list of all campaigns.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all campaigns retrieved successfully.',
  })
  async getAllCampaigns() {
    return this.campaignService.findAll();
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get campaign details by slug',
    description: 'Retrieves the details of a campaign using its slug.',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaign details retrieved successfully.',
  })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the campaign to retrieve',
    type: String,
  })
  async getCampaignDetailsBySlug(@Param('slug') slug: string) {
    return this.campaignService.findCampaignDetailsBySlug(slug);
  }

  @Get('organization/:organizationId')
  @ApiOperation({
    summary: 'Get campaigns by organization ID',
    description:
      'Retrieves all campaigns associated with a specific organization.',
  })
  @ApiResponse({
    status: 200,
    description:
      'List of campaigns for the specified organization retrieved successfully.',
  })
  @ApiParam({
    name: 'organizationId',
    description: 'The ID of the organization to retrieve campaigns for',
    type: String,
  })
  async getCampaignsByOrganization(
    @Param('organizationId') organizationId: string,
  ) {
    return this.campaignService.findAllByOrganization(organizationId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get campaign details by ID',
    description: 'Retrieves the details of a campaign using its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaign details retrieved successfully.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the campaign to retrieve',
    type: String,
  })
  async getCampaignDetailsById(@Param('id') id: string) {
    return this.campaignService.findCampaignById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a campaign',
    description: 'Updates the details of an existing campaign.',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaign updated successfully.',
  })
  async updateCampaign(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a campaign',
    description: 'Deletes an existing campaign by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaign deleted successfully.',
  })
  async deleteCampaign(@Param('id') id: string) {
    return this.campaignService.delete(id);
  }
}
