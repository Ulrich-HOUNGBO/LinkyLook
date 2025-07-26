import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule, LoggerModule, RedisModule } from '@app/common';
import { OrganizationModule } from './organization/organization.module';
import { AuthModule } from './auth/auth.module';
import { CampaignModule } from './campaign/campaign.module';
import { ModelesModule } from './modeles/modeles.module';
import { LinksModule } from './links/links.module';
import { BullMqModule } from '@app/common/queue/queue.module';
import { RolesModule } from './roles/roles.module';
import { UserOrganizationModule } from './user-organization/user-organization.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InvitationModule } from './invitation/invitation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    LoggerModule,
    RedisModule,
    CacheModule,
    BullMqModule,
    UsersModule,
    AuthModule,
    ModelesModule,
    CampaignModule,
    OrganizationModule,
    LinksModule,
    RolesModule,
    UserOrganizationModule,
    InvitationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
