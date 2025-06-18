import { Injectable } from '@nestjs/common';
import { CampaignRepository } from './models/campaign.repository';

@Injectable()
export class CampaignService {
  constructor(private readonly campaignRepository: CampaignRepository) {}
}
