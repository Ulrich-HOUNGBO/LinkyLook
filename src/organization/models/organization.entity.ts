import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/database/postgresql';
import { Roles } from '../../roles/entities/role.entity';
import { UserOrganizations } from '../../user-organization/models/user-organization.entity';
import { Links } from '../../links/models/links.entity';

@Entity({ name: 'Organizations' })
export class Organizations extends AbstractEntity<Organizations> {
  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, unique: true })
  slug: string;

  @OneToMany(() => UserOrganizations, (userOrg) => userOrg.organization)
  userOrganizations: UserOrganizations[];

  @OneToMany(() => Roles, (role) => role.organization)
  roles: Roles[];

  @OneToMany(() => Links, (link) => link.organization, {
    nullable: true,
    eager: false,
  })
  links: Links[];
}
