import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Campaigns } from '../../campaign/models/campaign.entity';
import { Users } from '../../users/models/users.entity';
import { Organizations } from '../../organization/models/organization.entity';

@Entity({ name: 'Links' })
export class Links extends AbstractEntity<Links> {
  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ['direct', 'landing'], default: 'direct' })
  type: 'direct' | 'landing';

  @Column({ type: 'varchar', length: 255, nullable: true })
  targetUrl?: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'boolean', default: false })
  shielded: boolean;

  @ManyToOne(() => Campaigns, (campaign) => campaign.links, {
    eager: true,
    nullable: true,
  })
  campaign?: Campaigns;

  @ManyToOne(() => Users, (user) => user.links, {
    eager: true,
    nullable: true,
  })
  createdBy?: Users;

  @ManyToOne(() => Organizations, (organization) => organization.links)
  organization?: Organizations;
}
