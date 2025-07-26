import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleRepository } from './entities/role.repository';
import { DatabaseModule } from '@app/common';
import { Roles } from './entities/role.entity';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Roles])],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
  exports: [RolesService],
})
export class RolesModule {}
