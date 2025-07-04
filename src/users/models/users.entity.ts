import { AbstractEntity } from '@app/common/database/postgresql';
import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserOrganizations } from '../../organization/models/user-organization.entity';
import { Links } from '../../links/models/links.entity';

@Entity({ name: 'Users' })
export class Users extends AbstractEntity<Users> {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  profileUrl: string;

  @Column({ nullable: false, default: false })
  verified: boolean;

  @Exclude()
  @Column({ nullable: true })
  googleId: string;

  @OneToMany(() => UserOrganizations, (userOrg) => userOrg.user)
  userOrganizations: UserOrganizations[];

  @OneToMany(() => Links, (link: Links) => link.createdBy)
  links: Links;
}
