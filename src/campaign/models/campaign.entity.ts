import { AbstractEntity } from '@app/common/database';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Modeles } from '../../modeles/models/modeles.entity';
import { Organizations } from '../../organization/models/organization.entity';
import { Links } from '../../links/models/links.entity';

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

  @OneToMany(() => Links, (link) => link.campaign, {
    nullable: true,
  })
  links: Links[];
}
