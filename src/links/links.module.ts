import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { DatabaseModule } from '@app/common';
import { Links } from './models/links.entity';
import { LinksRepository } from './models/links.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Links])],
  controllers: [LinksController],
  providers: [LinksService, LinksRepository],
})
export class LinksModule {}
