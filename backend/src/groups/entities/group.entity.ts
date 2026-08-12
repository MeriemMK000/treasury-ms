import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { BusinessUnit } from '../../business-units/entities/business-unit.entity';
import { User } from '../../users/entities/user.entity';

@Entity('groups')
export class Group extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'legal_name', nullable: true })
  legalName: string;

  @Column({ nullable: true })
  nif: string;

  @Column({ nullable: true })
  nis: string;

  @Column({ nullable: true })
  rc: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => BusinessUnit, (bu) => bu.group)
  businessUnits: BusinessUnit[];

  @OneToMany(() => User, (u) => u.group)
  users: User[];
}
