import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Organizations } from '../../organization/models/organization.entity';
import { Users } from '../../users/models/users.entity';
import { InvitationStatus } from '@app/common/enums/invitation-status.enum';
import { Exclude } from 'class-transformer';

@Entity('invitations')
@Index(['token'], { unique: true })
export class Invitations extends AbstractEntity<Invitations> {
  @Exclude()
  @Column({ type: 'uuid', unique: true })
  token: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  role: string;

  @ManyToOne(() => Users, { nullable: false })
  invitedBy: Users;

  @ManyToOne(() => Organizations, { nullable: false })
  organization: Organizations;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;
}
