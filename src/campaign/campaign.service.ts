import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignRepository } from './models/campaign.repository';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { Campaigns } from './models/campaign.entity';
import { createSlug } from '@app/common/utils';

@Injectable()
export class CampaignService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async create(createCampaignDto: CreateCampaignDto) {
    const campaign = new Campaigns(createCampaignDto);
    campaign.slug = createSlug(createCampaignDto.name);
    Object.assign(campaign, createCampaignDto);
    return this.campaignRepository.create(campaign);
  }

  async findAllByOrganization(organizationId: string) {
    return await this.campaignRepository.find({
      where: { organization: { id: organizationId } },
    });
  }

  async findCampaignDetailsBySlug(slug: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { slug },
      relations: ['models', 'organization', 'links'],
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with slug ${slug} not found`);
    }

    return campaign;
  }

  async findCampaignById(id: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['models', 'organization', 'links'],
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async findAll() {
    return this.campaignRepository.find({
      relations: ['models', 'organization', 'links'],
    });
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) {
      throw new NotFoundException(`Campaign not found`);
    }

    await this.campaignRepository.update({ id }, updateCampaignDto);
  }

  async delete(id: string) {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) {
      throw new NotFoundException(`Campaign not found`);
    }

    return this.campaignRepository.softDelete({ id });
  }
}
