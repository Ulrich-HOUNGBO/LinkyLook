import { Injectable, Logger } from '@nestjs/common';
import { MailsService } from '@app/common/mails/mails.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { VerifyMailQueueDto } from '@app/common/mails/dto/verify-mail.dto';
import { ConfigService } from '@nestjs/config';
import { VERIFY_MAILS_QUEUE } from '@app/common/constants/queue';
import {
  VERIFY_EMAIL_SUBJECT,
  VERIFY_EMAIL_TEMPLATE,
} from '@app/common/constants';

@Injectable()
@Processor(VERIFY_MAILS_QUEUE)
export class VerifyMailConsumer extends WorkerHost {
  private readonly logger = new Logger(VerifyMailConsumer.name);

  constructor(
    private readonly mailService: MailsService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<VerifyMailQueueDto>) {
    this.logger.log(`Processing job with data: ${JSON.stringify(job.data)}`);
    const { email, token, variables } = job.data;

    try {
      await this.mailService.sendTemplateEmail(
        email,
        VERIFY_EMAIL_SUBJECT,
        VERIFY_EMAIL_TEMPLATE,
        {
          ...variables,
          verificationLink: `${this.configService.getOrThrow<string>('FRONTEND_URL')}/verify-email?token=${token}`,
        },
      );
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to send verification email: ${error.message}`,
        );
      } else {
        this.logger.error('Failed to send verification email: Unknown error');
      }
      throw error;
    }
  }
}
