import { Global, Module } from '@nestjs/common';
import { MailsService } from '@app/common/mails/mails.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
