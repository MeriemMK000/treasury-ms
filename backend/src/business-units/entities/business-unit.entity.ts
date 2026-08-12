import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity('business_units')
export class BusinessUnit extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'legal_name', nullable: true })
  legalName: string;

  @Column({ nullable: true })
  nif: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => Group, (g) => g.businessUnits)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
