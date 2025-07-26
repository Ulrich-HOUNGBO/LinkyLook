import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Invitations } from './models/invitation.entity';
import { InvitationRepository } from './models/invitation.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Users } from '../users/models/users.entity';
import { INVITATION_CREATED_EVENT } from '@app/common/constants';

@Injectable()
export class InvitationService {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createInvitation(
    invitationData: CreateInvitationDto,
    user: Users,
  ): Promise<Invitations> {
    const tokens = this.generateInvitationToken();
    const newInvitation = new Invitations(invitationData);
    newInvitation.token = tokens.hashedToken;
    newInvitation.expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    );
    newInvitation.invitedBy = user;

    Object.assign(newInvitation, invitationData);
    const invitation = await this.invitationRepository.create(newInvitation);
    await this.eventEmitter.emitAsync(INVITATION_CREATED_EVENT, {
      email: invitation.email,
      token: tokens.token,
    });
    return invitation;
  }

  async findInvitationById(id: string): Promise<Invitations> {
    return this.invitationRepository.findOne({ where: { id } });
  }

  async findInvitationsByOrganizationId(
    organizationId: string,
  ): Promise<Invitations[]> {
    return this.invitationRepository.find({
      where: { organization: organizationId },
    });
  }

  async updateInvitation(
    id: string,
    updateData: UpdateInvitationDto,
  ): Promise<Invitations> {
    await this.invitationRepository.update(id, updateData);
    return this.findInvitationById(id);
  }

  async deleteInvitation(id: string): Promise<void> {
    await this.invitationRepository.delete(id);
  }

  async acceptInvitation(id: string, userId: string): Promise<Invitations> {
    const invitation = await this.findInvitationById(id);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    invitation.accepted = true;
    invitation.acceptedBy = userId;
    return this.invitationRepository.save(invitation);
  }

  async rejectInvitation(id: string): Promise<Invitations> {
    const invitation = await this.findInvitationById(id);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    invitation.accepted = false;
    return this.invitationRepository.save(invitation);
  }

  private async sendEmailInvitation(
    email: string,
    organizationId: string,
  ): Promise<void> {
    // Logic to send email invitation
    // This could involve using a mail service like Nodemailer or any other email service provider
    console.log(
      `Sending invitation to ${email} for organization ${organizationId}`,
    );
  }

  private generateInvitationToken(): { hashedToken: string; token: string } {
    const token = crypto.randomBytes(16).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return {
      token,
      hashedToken,
    };
  }
}
