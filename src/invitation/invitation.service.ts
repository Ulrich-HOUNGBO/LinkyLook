import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Invitations } from './models/invitation.entity';
import { InvitationRepository } from './models/invitation.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Users } from '../users/models/users.entity';
import { INVITATION_CREATED_EVENT } from '@app/common/constants';
import { InvitationStatus } from '@app/common/enums/invitation-status.enum';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@Injectable()
export class InvitationService {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
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

  async findInvitationById(id: string): Promise<Invitations | null> {
    return this.invitationRepository.findOne({ where: { id } });
  }

  async findInvitationsByOrganizationId(
    organizationId: string,
  ): Promise<Invitations[]> {
    return this.invitationRepository.find({ where: { id: organizationId } });
  }

  async updateInvitation(
    id: string,
    updateData: UpdateInvitationDto,
  ): Promise<Invitations | null> {
    return await this.invitationRepository.update({ id }, updateData);
  }

  async deleteInvitation(id: string): Promise<void> {
    await this.invitationRepository.delete({ id });
  }

  async acceptInvitation(id: string): Promise<Invitations | null> {
    const invitation = await this.findInvitationById(id);
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    return this.invitationRepository.update(
      { id },
      {
        status: InvitationStatus.ACCEPTED,
      },
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
