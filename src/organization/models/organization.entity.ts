import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/database/postgresql';
import { Roles } from './role.entity';
import { UserOrganizations } from './user-organization.entity';

@Entity({ name: 'Organizations' })
export class Organizations extends AbstractEntity<Organizations> {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, unique: true })
  slug: string;

  @OneToMany(() => UserOrganizations, (userOrg) => userOrg.organization)
  userOrganizations: UserOrganizations[];

  @OneToMany(() => Roles, (role) => role.organization)
  roles: Roles[];
}
