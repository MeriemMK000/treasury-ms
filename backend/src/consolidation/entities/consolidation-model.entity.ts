import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity('consolidation_models')
export class ConsolidationModel extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('uuid', { name: 'business_unit_ids', array: true, default: '{}' })
  businessUnitIds: string[];

  @Column('uuid', { name: 'bank_ids', array: true, default: '{}' })
  bankIds: string[];

  @Column('uuid', { name: 'bank_agency_ids', array: true, default: '{}' })
  bankAgencyIds: string[];

  @Column({ name: 'include_all_accounts', default: false })
  includeAllAccounts: boolean;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}
