import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  INVITATION_QUEUE,
  VERIFY_MAILS_QUEUE,
} from '@app/common/constants/queue';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: VERIFY_MAILS_QUEUE,
    }),

    BullModule.registerQueue({
      name: INVITATION_QUEUE,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [BullModule],
})
export class BullMqModule {}
