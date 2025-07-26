import { OnEvent } from '@nestjs/event-emitter';
import {
  INVITATION_CREATED_EVENT,
  INVITATION_QUEUE,
} from '@app/common/constants';
import { InvitationService } from './invitation.service';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class InvitationListener {
  protected readonly logger = new Logger(InvitationListener.name);
  constructor(
    private readonly invitationService: InvitationService,
    @InjectQueue(INVITATION_QUEUE)
    private readonly invitationQueue: Queue,
  ) {}

  @OnEvent(INVITATION_CREATED_EVENT)
  async handleInvitationCreatedEvent(token: string, email: string) {
    // Logic to handle the invitation created event, e.g., sending an email
    await this.invitationQueue.add('send-invitation', {
      token,
      email,
    });
    this.logger.log(
      `Invitation created for email: ${email} with token: ${token}`,
    );
  }
}
