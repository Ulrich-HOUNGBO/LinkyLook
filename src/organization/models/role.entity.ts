import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@app/common/database/postgresql';
import { Organizations } from './organization.entity';

@Entity({ name: 'Roles' })
export class Roles extends AbstractEntity<Roles> {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-json', { nullable: true })
  permissions: Record<string, boolean>;

  @ManyToOne(() => Organizations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization: Organizations;

  @Column({ nullable: false })
  organizationId: string;
}
