import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common/database/postgresql';
import { Organizations } from '../../organization/models/organization.entity';

@Entity({ name: 'Modeles' })
export class Modeles extends AbstractEntity<Modeles> {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Organizations, (organization) => organization)
  organization: Organizations;
}
