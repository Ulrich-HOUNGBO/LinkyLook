import { Module } from '@nestjs/common';
import { ModelesService } from './modeles.service';
import { ModelesController } from './modeles.controller';
import { DatabaseModule } from '@app/common';
import { Modeles } from './models/modeles.entity';
import { ModelesRepository } from './models/modeles.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Modeles])],
  controllers: [ModelesController],
  providers: [ModelesService, ModelesRepository],
})
export class ModelesModule {}
