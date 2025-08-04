import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { MailsService } from '@app/common/mails/mails.service';
import { FORGOT_PASSWORD_QUEUE } from '@app/common/constants/queue';
import { Job } from 'bullmq';
import { ResetPasswordQueueDto } from '@app/common/queue/dto/reset-password.dto';
import { RESET_PWD_SUBJECT, RESET_PWD_TEMPLATE } from '@app/common/constants';

@Injectable()
@Processor(FORGOT_PASSWORD_QUEUE)
export class ForgotPasswordConsumer extends WorkerHost {
  private readonly logger = new Logger(ForgotPasswordConsumer.name);

  constructor(
    private readonly mailService: MailsService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<ResetPasswordQueueDto>) {
    this.logger.log(`Processing job ${job.id} in ${FORGOT_PASSWORD_QUEUE}`);

    const { email, token } = job.data;

    try {
      await this.mailService.sendTemplateEmail(
        email,
        RESET_PWD_SUBJECT,
        RESET_PWD_TEMPLATE,
        {
          reset_link: `${this.configService.getOrThrow<string>('FRONTEND_URL')}/reset-password?token=${token}`,
        },
      );
      this.logger.log(`Forgot password email sent to ${email}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to send forgot password email: ${error.message}`,
        );
      } else {
        this.logger.error(
          'Failed to send forgot password email: Unknown error',
        );
      }
      throw error; // Re-throw to mark the job as failed
    }
  }
}
