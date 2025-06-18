import { AbstractEntity } from '@app/common/database/postgresql';
import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserOrganizations } from '../../organization/models/user-organization.entity';

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

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  profileUrl: string;

  @Column({ nullable: false, default: false })
  verified: boolean;

  @Column({ nullable: true })
  googleId: string;

  @OneToMany(() => UserOrganizations, (userOrg) => userOrg.user)
  userOrganizations: UserOrganizations[];
}
