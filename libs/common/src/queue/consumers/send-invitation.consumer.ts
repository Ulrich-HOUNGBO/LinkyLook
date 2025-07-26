import {
  INVITATION_QUEUE,
  SEND_INVITE_SUBJECT,
  SEND_INVITE_TEMPLATE,
} from '@app/common/constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { MailsService } from '@app/common/mails/mails.service';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';

@Injectable()
@Processor(INVITATION_QUEUE)
export class SendInvitationConsumer extends WorkerHost {
  protected readonly logger = new Logger(SendInvitationConsumer.name);

  constructor(
    private readonly mailService: MailsService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<{ token: string; email: string }>) {
    this.logger.log(`Processing job with data: ${JSON.stringify(job.data)}`);

    try {
      await this.mailService.sendTemplateEmail(
        job.data.email,
        SEND_INVITE_SUBJECT,
        SEND_INVITE_TEMPLATE,
        {
          token: job.data.token,
          frontendUrl: this.configService.getOrThrow<string>('FRONTEND_URL'),
        },
      );
      this.logger.log(`Invitation email sent to ${job.data.email}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to send invitation email: ${error.message}`);
      } else {
        this.logger.error('Failed to send invitation email: Unknown error');
      }
      throw error;
    }
  }
}
