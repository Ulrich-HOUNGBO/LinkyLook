import { AbstractEntity } from '@app/common/database';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Modeles } from '../../modeles/models/modeles.entity';
import { Organizations } from '../../organization/models/organization.entity';

@Entity({
  name: 'Campaigns',
})
export class Campaigns extends AbstractEntity<Campaigns> {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Modeles, (model) => model)
  models: Modeles;

  @ManyToOne(() => Organizations, (organization) => organization)
  organization: Organizations;
}
