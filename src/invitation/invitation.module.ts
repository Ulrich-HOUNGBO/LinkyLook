import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { DatabaseModule } from '@app/common';
import { Invitations } from './models/invitation.entity';
import { InvitationListener } from './invitation.listener';
import { InvitationRepository } from './models/invitation.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Invitations])],
  controllers: [InvitationController],
  providers: [InvitationService, InvitationRepository, InvitationListener],
  exports: [InvitationService],
})
export class InvitationModule {}
