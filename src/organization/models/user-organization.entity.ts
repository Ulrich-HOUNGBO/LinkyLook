import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from '@app/common/database/postgresql';
import { Organizations } from './organization.entity';
import { Users } from '../../users/models/users.entity';
import { Roles } from './role.entity';

@Entity({ name: 'UserOrganizations' })
@Unique(['userId', 'organizationId'])
export class UserOrganizations extends AbstractEntity<UserOrganizations> {
  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => Organizations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization: Organizations;

  @Column({ nullable: false })
  organizationId: string;

  @ManyToOne(() => Roles, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'roleId' })
  role: Roles;

  @Column({ nullable: true })
  roleId: string;
}
