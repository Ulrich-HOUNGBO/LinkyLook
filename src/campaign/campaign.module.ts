import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { DatabaseModule } from '@app/common';
import { Campaigns } from './models/campaign.entity';
import { CampaignRepository } from './models/campaign.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Campaigns])],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository],
})
export class CampaignModule {}
